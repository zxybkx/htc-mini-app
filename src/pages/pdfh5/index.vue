<style>
	.app {
        width: 100%;
  }
</style>
<template>
  <div class="app">
    <pdf :src="pdfSrc" ref="pdf" @loaded="docLoaded"/>
  </div>
</template>
<script>
import {BASE_URL} from '../../api/config'
import pdf from 'vue-pdf-signature'
import CMapReaderFactory from 'vue-pdf-signature/src/CMapReaderFactory.js'
  export default {
    data() {
      return {
        pdfSrc: null
      };
    },
    components: {
      pdf
    },
    methods:{
      docLoaded(){
        uni.hideLoading();
      }
    },
    onLoad(options){
        try {
            uni.showLoading()
            const value = options.url;
            if (value) {
                let bucketName=value.includes('hocr')?'hocr':'hivp'
                this.pdfSrc = pdf.createLoadingTask({
                    url: `${BASE_URL}/hcan/v1/0/file-download/by-url?bucketName=${bucketName}&fileUrl=${value}`,
                    httpHeaders: {
                      Authorization: uni.getStorageSync('token')
                    },
                    CMapReaderFactory,
                    //引入 pdf.js 字体，templ
                    cMapUrl: '../../static/cmaps',
                    cMapPacked: true,
                })
            }
        } catch (e) {
            console.log(e);
            // error
        }
        
    }
  }
</script>