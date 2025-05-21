#!/bin/bash

# ==========================
# Script: githubPusher.sh
# Interactive script to push your local project to GitHub
# ==========================

echo "🚀 أهلاً بيك في githubPusher! أداة رفع مشاريعك على GitHub بسهولة."

# سؤال عن مكان المشروع
read -p "❓ هل المشروع في نفس الفولدر اللي فيه السكربت؟ (y/n): " SAME_FOLDER

if [ "$SAME_FOLDER" = "y" ]; then
  PROJECT_DIR=$(pwd)
else
  read -p "📁 اكتب المسار الكامل لفولدر المشروع: " PROJECT_DIR
fi

# باقي البيانات
read -p "👤 GitHub Username: " GITHUB_USERNAME
read -s -p "🔑 GitHub Token (هيفضل مخفي وأنت بتكتبه): " GITHUB_TOKEN
echo ""
read -p "🔗 لينك الريبو (مثال: https://github.com/username/repo.git): " REPO_URL

# تأكيد البيانات
echo ""
echo "🔍 تأكيد البيانات:"
echo "- 📁 المشروع: $PROJECT_DIR"
echo "- 👤 يوزرنيم: $GITHUB_USERNAME"
echo "- 🔗 ريبو: $REPO_URL"
read -p "✅ كمل؟ (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "❌ تم الإلغاء."
  exit 1
fi

# إضافة التوكن للينك
AUTH_REPO_URL=$(echo "$REPO_URL" | sed -e "s#https://#https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@#")

# التنقل للمجلد
cd "$PROJECT_DIR" || { echo "❌ المجلد $PROJECT_DIR مش موجود!"; exit 1; }

# تهيئة الجيت لو مش متعمل
if [ ! -d ".git" ]; then
  git init
fi

# إعدادات الجيت
git remote remove origin 2> /dev/null
git remote add origin "$AUTH_REPO_URL"

git add .
git commit -m "Initial project push by githubPusher 🚀"
git branch -M main
git push -u origin main

echo "✅ تم رفع المشروع بنجاح على GitHub!"

