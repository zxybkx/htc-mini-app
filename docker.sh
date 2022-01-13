# 报错不继续执行
###
 # @Description: 
 # @version: 1.0
 # @Author: yang.wang04@hand-china.com
 # @Date: 2021-02-24 14:36:35
 # @LastEditTime: 2021-02-24 14:57:20
 # @Copyright: Copyright (c) 2020, Hand
### 
#git pull
#
# gitPullErrorCode=$?
#
# if [ 0 -ne $gitPullErrorCode ]; then
#   echo "git pull error, try back yarn.lock, and pull again";
#   mv yarn.lock "yarn.lock.`date +"%Y-%m-%d_%H-%M-%S"`.bak" # decide yarn.lock has conflict
#   git pull;
# fi;
#
# if [ 0 -ne $? ]; then
#   exit "git pull error";
# fi;
#
# set -e # 报错不继续执行
#

echo "begin yarn ....."


npm install
npm run build



echo "begin copy md ....."




#将打包好的文件cp到根目录下
#ROBOCOPY ./dist/dev/h5 ./h5_html /E /MT:30
#rm -r -force ./h5_html
#cp -r ./dist/dev/h5 ./h5_html

echo "begin docker init ....."
# 生成镜像名称

#imageName=registry.choerodon.com.cn/htc/htc-uni:1.6.6-prod
imageName=$(date "+registry.choerodon.com.cn/htc/htc-uni:%Y-%m-%d-%H%M%S")-uat
echo $imageName

# 登陆 docker
docker login -u User6371438 -p User6371438PWD registry.choerodon.com.cn
# 创建镜像
docker build --pull -t $imageName .
# 上传镜像
docker push $imageName

# 输出提示信息
echo '======================== develop 构建成功 ========================'

echo '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n'
# 打印镜像名称
echo "镜像名称为："$imageName






