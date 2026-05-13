@echo off
chcp 65001 >nul
echo ========================================
echo 家庭餐单应用 - Gitee 上传脚本
echo ========================================
echo.

REM 检查是否已初始化 git
if not exist .git (
    echo 初始化 Git 仓库...
    git init
    echo.
)

REM 添加 dist 文件夹
echo 添加文件到 Git...
git add dist/
echo.

REM 提交
echo 提交更改...
git commit -m "部署家庭餐单应用"
echo.

echo ========================================
echo 接下来请执行以下命令关联你的 Gitee 仓库：
echo.
echo git remote add origin https://gitee.com/你的用户名/family-meal-planner.git
echo git push -u origin master
echo.
echo 请将"你的用户名"替换为你的实际 Gitee 用户名
echo ========================================
pause
