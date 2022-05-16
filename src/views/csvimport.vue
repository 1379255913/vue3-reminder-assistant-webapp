<template>
    <div>
        <van-nav-bar
                title="批量导入物品"
                left-text="返回"
                right-text="帮助"
                left-arrow
                @click-left="onClickLeft"
        />
        <br/>
        <van-cell title="导入格式" class="title1" >
            <!-- 使用 title 插槽来自定义标题 -->
            <template #label>
                <van-radio-group v-model="ways" direction="horizontal">
                    <van-radio name="1" icon-size="20" class="text1">按照导出格式导入</van-radio>
                    <van-radio name="2" icon-size="20" class="text1">按照正常格式导入</van-radio>
                </van-radio-group>
            </template>
        </van-cell>
        <van-divider />
        <van-cell title="上传文件" class="title1">
            <template #label>
                <van-uploader v-model="fileList" accept="" :max-count="1" :before-read="beforeRead">
                    <van-button icon="plus" type="primary" size="large">上传文件</van-button>
                </van-uploader>
            </template>
        </van-cell>
        <van-divider />
        <div style="margin: 16px;">
            <van-button round block type="primary" @click="imports">
                <div>导入</div>
            </van-button>
        </div>
    </div>
</template>

<script>
import { toRefs,reactive,onUnmounted,onMounted } from 'vue'
import emitter from "@/event";
import {Toast} from "vant";
import Papa from 'papaparse';
import jschardet from 'jschardet';
import randomid from "@/randomid";
import moment from  "moment";
import states from "@/state";
export default {
    name: "csvimport",
    setup(){
        const state = reactive({
            fileList : [],
            ways : "1"
        })
        const beforeRead = (file) => {
            console.log(file.type)
            if (file.type !== 'text/csv' &&file.type!== 'text/comma-separated-values') {
                Toast('请上传 csv 格式文件');
                return false;
            }
            return true;
        };
        const checkEncoding=(base64Str)=> {
            // 这种方式得到的是一种二进制串
            var str = atob(base64Str.split(';base64,')[1])
            // console.log(str);
            // 要用二进制格式
            var encoding = jschardet.detect(str)
            encoding = encoding.encoding
            // console.log( encoding );
            if (encoding === 'windows-1252') {	// 有时会识别错误（如UTF8的中文二字）
                encoding = 'ANSI'
            }
            return encoding
        }
        const imports=()=>{
            if (state.fileList.length!==0){
                console.log(state.fileList[0]);
                if (state.ways==="1"){
                    Papa.parse(state.fileList[0].file, {
                        complete: function(results) {
                            try{
                                console.log("Finished:", results.data);
                                let t = results.data;
                                let data=[];
                                let importid = [];
                                let type = [];
                                let type_id = [];
                                for (let i=1;i<t.length;i++){
                                    let ans = {};
                                    //防止id重复
                                    if (importid.indexOf(t[i][7])!==-1) continue;
                                    else importid.push(t[i][7]);
                                    if (t[i].length!==t[0].length) continue;
                                    for (let j=0;j<t[i].length;j++){
                                        ans[t[0][j]]=t[i][j];
                                        if (t[0][j]==="type_id" && type_id.indexOf(t[i][j])===-1) {
                                            type_id.push(t[i][j]);
                                            type.push(t[i][j-1]);
                                        }
                                    }
                                    data.push(ans);
                                }
                                let tags = JSON.parse(localStorage.getItem("tags"));
                                if (!tags){
                                    tags = [];
                                }
                                let tags_id = []
                                for (let i=0;i<tags.length;i++){
                                    tags_id.push(tags[i].id);
                                }
                                for (let i=0;i<type_id.length;i++){
                                    if (tags_id.indexOf(type_id[i])===-1){
                                        console.log(1111);
                                        tags.push({
                                            "type" : type[i],
                                            "count" : 0,
                                            "id" : type_id[i],
                                        });
                                    }
                                }
                                localStorage.setItem("tags",JSON.stringify(tags));
                                let o = JSON.parse(localStorage.getItem("objects")) || [];
                                let obj_id =[]
                                for (let i=0;i<o.length;i++){
                                    obj_id.push(o[i].id);
                                }
                                for (let i=0;i<data.length;i++){
                                    t = obj_id.indexOf(data[i].id)
                                    if (t===-1){
                                        o.push(data[i]);
                                    } else {
                                        o[t] = data[i];
                                    }
                                }
                                localStorage.setItem("objects",JSON.stringify(o));
                                Toast('导入成功');
                                console.log(type,type_id);
                                console.log(data);
                            } catch (e) {
                                Toast('传入数据格式不对');
                            }


                        }
                    });
                } else if (state.ways==="2"){
                    const fReader = new FileReader()
                    fReader.readAsDataURL(state.fileList[0].file)
                    fReader.onload = function(evt) {
                        const data = evt.target.result
                        const encoding = checkEncoding(data);
                        Papa.parse(state.fileList[0].file, {
                            encoding: encoding,
                            complete: function(results) {
                                try{
                                    console.log("Finished:", results.data);
                                    let t = results.data;
                                    if (t[0].toString()!==['物品名', '生产日期', '保质期', '保质期单位', '过期日期', '临期通知', '标签'].toString()) {
                                        Toast('传入数据格式不对');
                                        return;
                                    }
                                    let tags = JSON.parse(localStorage.getItem("tags")) || [];
                                    let tags_name =[]
                                    let tags_id = []
                                    for (let i=0;i<tags.length;i++){
                                        tags_name.push(tags[i].type);
                                        tags_id.push(tags[i].id);
                                    }
                                    // 处理标签
                                    for (let i=1;i<t.length;i++){
                                        if (t[i].length===1) continue;
                                        t[i].push(randomid()); //t[i][7]是id
                                        let a = tags_name.indexOf(t[i][6])
                                        if (a===-1){
                                            let id =randomid()
                                            tags.push({
                                                "type" : t[i][6],
                                                "count" : 0,
                                                "id" : id,
                                            });
                                            tags_name.push(t[i][6]);
                                            tags_id.push(id);
                                            t[i].push(id);
                                        } else {
                                            t[i].push(tags_id[a]);//t[i][8]是type_id
                                        }
                                    }
                                    let o = JSON.parse(localStorage.getItem("objects")) || [];
                                    // 处理时间
                                    for (let i=1;i<t.length;i++){
                                        if (t[i].length===1) continue;
                                        if (t[i][2]!=="0"){
                                            if (t[i][1] && !t[i][4]){
                                                let t1 = moment(t[i][1])
                                                if (t[i][3]==="年"){
                                                    t1.add(t[i][2],"years")
                                                }else if (t[i][3]==="月"){
                                                    t1.add(t[i][2],"months")
                                                }else if (t[i][3]==="日"){
                                                    t1.add(t[i][2],"days")
                                                }else {
                                                    Toast('传入数据格式不对');
                                                    return;
                                                }
                                                t[i][4]=t1.format('YYYY-MM-DD');
                                            } else if (!t[i][1] && t[i][4]){
                                                let t1 = moment(t[i][4])
                                                if (t[i][3]==="年"){
                                                    t1.subtract(t[i][2],"years")
                                                }else if (t[i][3]==="月"){
                                                    t1.subtract(t[i][2],"months")
                                                }else if (t[i][3]==="日"){
                                                    t1.subtract(t[i][2],"days")
                                                }else {
                                                    Toast('传入数据格式不对1');
                                                    return;
                                                }
                                                t[i][1]=t1.format('YYYY-MM-DD');
                                            } else if (!t[i][1] && !t[i][4]){
                                                Toast('传入数据格式不对2'+i);
                                                return;
                                            }
                                        }
                                        //
                                        let re_t = parseInt(t[i][5]);
                                        console.log(re_t);
                                        if (re_t>=1){
                                            let t1 = moment(t[i][4]);
                                            t[i][5] = t1.subtract(re_t,"days").format('YYYY-MM-DD');
                                        }else {
                                            Toast('传入数据格式不对3');
                                            return;
                                        }
                                        t[i].push(states(t[i][4],t[i][5]));
                                        o.push({
                                            "information" : t[i][0],
                                            "manufacture_time" : t[i][1],
                                            "fresh_time_number" : t[i][2],
                                            "fresh_time_unit" : t[i][3],
                                            "expiration_time" :t[i][4],
                                            "reminder_time" :t[i][5],
                                            "state" : t[i][9],
                                            "id" : t[i][7],
                                            "type" : t[i][6],
                                            "type_id": t[i][8],
                                        })
                                    }
                                    console.log(o);
                                    localStorage.setItem("tags",JSON.stringify(tags));
                                    localStorage.setItem("objects",JSON.stringify(o));
                                    Toast('导入成功');
                                }catch (e) {
                                    console.log(e)
                                    Toast('传入数据格式不对');
                                }
                            }
                        })
                    }

                }

            }  else {
                Toast('还没有上传文件');
            }

        }
        const onClickLeft = () => {
            history.back();
        }
        onMounted(()=>{
            emitter.emit("tab","")

        })
        return{
            ...toRefs(state),
            onClickLeft,
            beforeRead,
            imports
        }
    }
}
</script>

<style scoped>
    .title1{
        font-size: 20px;
    }
</style>