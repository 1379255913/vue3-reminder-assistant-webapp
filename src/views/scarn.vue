<template>
<div class="page-scan">
    <!--返回-->
    <!-- <van-nav-bar
      title="扫描二维码/条形码"
      fixed
      @click-left="clickIndexLeft()"
      class="scan-index-bar">
      <template #left>
        <van-icon name="arrow-left" size="18" color="#fff"/>
        <span style="color: #fff">取消</span>
      </template>
    </van-nav-bar> -->
    <!-- 扫码区域 -->
    <div class="QrCode">
        <video ref="video" height="100%" width="100%" id="video" autoplay></video>
    </div>
    <!-- 扫码样式一 -->
    <!-- <div class="Qr_scanner">
      <div class="box">
        <div class="line_row">
          <div class="line"></div>
        </div>
        <div class="angle"></div>
      </div>
    </div> -->
    <!-- 扫码样式二 -->
    <div class="qr-scanner">
        <div class="box">
            <div class="line"></div>
            <div class="angle"></div>
        </div>
        <div class="back-arrow" @click="click">
            <van-icon name="arrow-left" color="#fff" />
        </div>
        <div class="right" @click="inputcode">
            <van-button type="primary">手动输入</van-button>
        </div>
    </div>
</div>
</template>

<script>
    // WebRTC适配器 只需要引入就ok


    import 'webrtc-adapter';
    import { BrowserMultiFormatReader } from '@zxing/library'
    import emitter from "@/event";
    import instance from "@/http";
    import { Dialog } from 'vant';
    export default {
        name: 'scanCodePage',

        data() {
            return {
                codeReader: null,
                warning : false,
            }
        },
        mounted() {
            this.codeReader = new BrowserMultiFormatReader()
            this.openScan()
        },
        beforeUnmount() {
            this.codeReader && this.codeReader.reset()
        },
        methods: {
            async openScan() {
                // this.codeReader.listVideoInputDevices().then(videoInputDevices => {
                //   // 默认获取第一个摄像头设备id
                //   videoInputDevices.forEach((device) =>
                //     alert(`${device.label}, ${device.deviceId}`)
                //   )
                //   let firstDeviceId = videoInputDevices[0].deviceId
                //   this.codeReader && this.codeReader.reset() // 重置
                //   this.decodeFromInputVideoFunc(firstDeviceId)
                // })

                // this.codeReader.getVideoInputDevices().then((videoInputDevices) => {
                this.codeReader.listVideoInputDevices().then((videoInputDevices) => {
                    // 默认获取第一个摄像头设备id
                    let firstDeviceId = videoInputDevices[0].deviceId
                    // 获取第一个摄像头设备的名称
                    const videoInputDeviceslablestr = JSON.stringify(videoInputDevices[0].label)
                    if (videoInputDevices.length > 1) {
                        // 判断是否后置摄像头
                        if (videoInputDeviceslablestr.indexOf('back') > -1) {
                            firstDeviceId = videoInputDevices[0].deviceId
                        } else {
                            firstDeviceId = videoInputDevices[1].deviceId
                        }
                    }
                    this.codeReader && this.codeReader.reset() // 重置
                    this.decodeFromInputVideoFunc(firstDeviceId)
                }).catch(err => {
                    console.error(err)
                })
            },
            decodeFromInputVideoFunc(firstDeviceId) {
                let that =this
                this.codeReader.decodeFromInputVideoDeviceContinuously(firstDeviceId, 'video', (result, err) => {
                    if (result) {
                        console.log('扫描结果', result)
                        if (result.text && !that.warning) {
                            this.clickIndexLeft(result.text)
                        }
                    }
                    if (err && !(err)) {
                        console.error(err)
                    }
                })
            },
            inputcode(){
                this.$router.push('/inputcode')
            },
            click(){
                history.back();
            },
            clickIndexLeft(result) {
                let that =this
                let t;
                console.log(result)
                if (result.length===13){

                    instance.post("/barcode",{
                        'code' : result
                    }).then(res =>{
                        that.warning = true;
                        t =res.data.data;
                        console.log(t)
                        if (t==="未找到相关记录"){
                            Dialog.alert({
                                title: '查询结果',
                                message: '未找到相关记录',
                            }).then(() => {
                                that.warning = false;
                            });
                        }
                        else {
                            let data = {
                                "information" : t,
                            }

                            that.codeReader && this.codeReader.reset()
                            that.codeReader = null
                            setTimeout(()=>{
                                emitter.emit("objectcreate",data)
                            },530);
                            history.back();
                        }
                    }).catch(function (error) {
                        Dialog.alert({
                            title: '错误',
                            message: '服务器错误，请稍后再试',
                        }).then(() => {
                            that.warning = false;
                        });
                        console.log(error.message);
                    });
                }
                else {
                    Dialog.alert({
                        title: '错误',
                        message: '查询非条形码',
                    }).then(() => {
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scope>
    // #region

    // .scan-index-bar{
    //   background-image: linear-gradient( -45deg, #42a5ff ,#59cfff);
    // }
    // .van-nav-bar__title{
    //   color: #fff !important;
    // }

    // #endregion

    /**
      扫码样式一
    */
    .QrCode {
        width: 100vw;
        height: 100vh;
        position: relative;
        #video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    /**
      扫码样式二
    */
    .qr-scanner {
        background-image:
                linear-gradient(0deg,
                        transparent 24%,
                        rgba(32, 255, 77, 0.1) 25%,
                        rgba(32, 255, 77, 0.1) 26%,
                        transparent 27%,
                        transparent 74%,
                        rgba(32, 255, 77, 0.1) 75%,
                        rgba(32, 255, 77, 0.1) 76%,
                        transparent 77%,
                        transparent),
                linear-gradient(90deg,
                        transparent 24%,
                        rgba(32, 255, 77, 0.1) 25%,
                        rgba(32, 255, 77, 0.1) 26%,
                        transparent 27%,
                        transparent 74%,
                        rgba(32, 255, 77, 0.1) 75%,
                        rgba(32, 255, 77, 0.1) 76%,
                        transparent 77%,
                        transparent);
        background-size: 3rem 3rem;
        background-position: -1rem -1rem;
        // width: 100%;
        // height: 100%;
        // position: relative;
        // background-color: #111;

        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .qr-scanner .box {
        width: 90vw;
        height: 40vw;
        max-height: 75vh;
        max-width: 75vh;
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        overflow: hidden;
        border: 0.1rem solid rgba(0, 255, 51, 0.2);
    }
    .qr-scanner .line {
        height: calc(100% - 2px);
        width: 100%;
        background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
        border-bottom: 3px solid #00ff33;
        transform: translateY(-100%);
        animation: radar-beam 2s infinite;
        animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
        animation-delay: 1.4s;
    }
    .qr-scanner .box:after,
    .qr-scanner .box:before,
    .qr-scanner .angle:after,
    .qr-scanner .angle:before {
        content: '';
        display: block;
        position: absolute;
        width: 3vw;
        height: 3vw;
        border: 0.2rem solid transparent;
    }
    .qr-scanner .box:after,
    .qr-scanner .box:before {
        top: 0;
        border-top-color: #00ff33;
    }
    .qr-scanner .angle:after,
    .qr-scanner .angle:before {
        bottom: 0;
        border-bottom-color: #00ff33;
    }
    .qr-scanner .box:before,
    .qr-scanner .angle:before {
        left: 0;
        border-left-color: #00ff33;
    }
    .qr-scanner .box:after,
    .qr-scanner .angle:after {
        right: 0;
        border-right-color: #00ff33;
    }
    @keyframes radar-beam {
        0% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(0);
        }
    }

    .qr-scanner .back-arrow {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 999;

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .qr-scanner .right {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 100px;
        height: 30px;
        border-radius: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 999;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>