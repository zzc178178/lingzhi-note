#!/usr/bin/env python3
"""
灵知笔记 H5 一键部署脚本
用法: python deploy.py [cos|netlify|all]
"""
import os
import sys
import shutil
import subprocess

# ===== 配置 =====
# 从环境变量读取密钥，避免硬编码
# 本地使用时设置环境变量：
#   $env:COS_SECRET_ID="your-secret-id"
#   $env:COS_SECRET_KEY="your-secret-key"
SECRET_ID = os.environ.get('COS_SECRET_ID', '')
SECRET_KEY = os.environ.get('COS_SECRET_KEY', '')
REGION = 'ap-guangzhou'
BUCKET = 'ai-note-h5-1351746008'
DEPLOY_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'deploy')
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')


def build():
    """构建项目"""
    print('🔨 构建项目...')
    # 尝试找到 npm
    npm_cmd = 'npm.cmd' if sys.platform == 'win32' else 'npm'
    result = subprocess.run([npm_cmd, 'run', 'build'], cwd=os.path.dirname(os.path.abspath(__file__)))
    if result.returncode != 0:
        print('❌ 构建失败')
        sys.exit(1)
    print('✅ 构建完成')


def prepare_deploy():
    """准备部署目录"""
    if os.path.exists(DEPLOY_DIR):
        shutil.rmtree(DEPLOY_DIR)
    shutil.copytree(DIST_DIR, DEPLOY_DIR)
    print('✅ 部署目录准备完成')


def deploy_cos():
    """部署到腾讯云 COS"""
    print('\n☁️  部署到腾讯云 COS...')
    try:
        from qcloud_cos import CosConfig, CosS3Client
    except ImportError:
        print('❌ 未安装 qcloud_cos，运行: pip install cos-python-sdk-v5')
        return False

    config = CosConfig(SecretId=SECRET_ID, SecretKey=SECRET_KEY, Region=REGION)
    client = CosS3Client(config)

    # 确保静态网站配置
    try:
        client.put_bucket_website(
            Bucket=BUCKET,
            WebsiteConfiguration={
                'IndexDocument': {'Suffix': 'index.html'},
                'ErrorDocument': {'Key': 'index.html'},
                'RedirectAllRequestsTo': {'Protocol': 'https'}
            }
        )
    except Exception as e:
        print(f'⚠️  静态网站配置: {e}')

    # 上传文件
    for root, dirs, files in os.walk(DEPLOY_DIR):
        for fname in files:
            local = os.path.join(root, fname)
            key = os.path.relpath(local, DEPLOY_DIR).replace(os.sep, '/')
            ct = 'text/html; charset=utf-8' if fname.endswith('.html') else \
                 'text/css' if fname.endswith('.css') else \
                 'application/javascript' if fname.endswith('.js') else 'text/plain'
            # 所有文件都 inline 显示，避免触发下载
            extra = {'ContentDisposition': 'inline'}
            with open(local, 'rb') as fh:
                client.put_object(Bucket=BUCKET, Key=key, Body=fh, ContentType=ct, **extra)
            print(f'  ✓ {key}')

    print(f'✅ COS 部署完成: http://{BUCKET}.cos-website.{REGION}.myqcloud.com')
    return True


def deploy_netlify():
    """部署到 Netlify"""
    print('\n🌐 部署到 Netlify...')
    result = subprocess.run(
        ['npx', 'netlify', 'deploy', '--prod', f'--dir={DEPLOY_DIR}', '--allow-anonymous'],
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    if result.returncode != 0:
        print('❌ Netlify 部署失败，请检查是否已登录')
        return False
    print('✅ Netlify 部署完成')
    return True


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else 'all'

    build()
    prepare_deploy()

    if target in ('cos', 'all'):
        deploy_cos()

    if target in ('netlify', 'all'):
        deploy_netlify()

    print('\n🎉 全部部署完成！')
    print(f'  COS:    http://{BUCKET}.cos-website.{REGION}.myqcloud.com')
    print(f'  Netlify: https://voluble-selkie-f2bd5e.netlify.app')


if __name__ == '__main__':
    main()