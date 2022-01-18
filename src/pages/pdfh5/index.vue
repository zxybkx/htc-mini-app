<style>
	@import "pdfh5/css/pdfh5.css";
	#app {
        width: 100%;
        height: 100%;
    }
</style>
<template>
  <div id="app">
    <pdf :src="pdfSrc" ref="pdf" />
  </div>
</template>
<script>
import pdf from 'vue-pdf-signature'
import CMapReaderFactory from 'vue-pdf-signature/src/CMapReaderFactory.js'
  export default {
	data() {
	  return {
	    pdfSrc: null
	  };
	},
    onLoad(){
        try {
            uni.showLoading()
            const query = uni.createSelectorQuery().in(this);
            const value = uni.getStorageSync('H5pdfUrl');
            if (value) {
                this.pdfSrc = pdf.createLoadingTask({
                    url: value,
                    CMapReaderFactory,
                    //引入 pdf.js 字体，templ
                    cMapUrl: '../../static/cmaps',
                    cMapPacked: true
                })
            }
            uni.hideLoading();
        } catch (e) {
            console.log(e);
            // error
        }
        
    }
  }
</script>