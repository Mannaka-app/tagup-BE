#!/bin/bash

# 색상 출력
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "${GREEN}📦 1. 로컬에서 NestJS 빌드 시작...${NC}"
npm run build

echo "${GREEN}🚀 2. dist 폴더 EC2로 업로드 중...${NC}"
scp -i /Users/donghyun/Downloads/back.pem -r dist/ ubuntu@ec2-3-34-44-18.ap-northeast-2.compute.amazonaws.com:~/tagup-BE/

echo "${GREEN}🔄 3. EC2 접속 후 PM2 재시작 중...${NC}"
ssh -i /Users/donghyun/Downloads/back.pem ubuntu@ec2-3-34-44-18.ap-northeast-2.compute.amazonaws.com << 'EOF'
  cd ~/tagup-BE
  pm2 restart ecosystem.config.js
  echo "${GREEN}✅ PM2 재시작 완료!${NC}"
EOF

echo "${GREEN}🎉 배포 완료!${NC}"