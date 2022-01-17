FROM registry.cn-hangzhou.aliyuncs.com/choerodon-tools/frontbase:0.5.0

RUN echo "Asia/shanghai" > /etc/timezone;
RUN sed -i 's/\#gzip/gzip/g' /etc/nginx/nginx.conf;
ADD ./dist/build/h5 /usr/share/nginx/h5_html
ADD ./WW_verify_ryXmrbb9BaIfJjqV.txt /usr/share/nginx/h5_html
ADD ./docker/nginx.conf /etc/nginx/nginx.conf
ADD ./docker/default.conf /etc/nginx/conf.d/
ADD ./static /usr/share/make-invoice/makeInvoice
ADD  ./docker/enterpoint.sh /usr/share/nginx/html/enterpoint.sh
RUN chmod 777 /usr/share/nginx/html/enterpoint.sh
ENTRYPOINT ["/usr/share/nginx/html/enterpoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80