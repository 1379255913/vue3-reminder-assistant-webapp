<template>
    <div>
        <van-form @submit="onSubmit()">
        <van-nav-bar
                title="查批号"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <br/>
        <van-cell-group inset>
            <van-field
                    v-model="brand"
                    is-link
                    readonly
                    required
                    label="品牌"
                    placeholder="请选择品牌"
                    @click="show=true"
                    :rules="[{ required: true, message: '请选择品牌' }]"
            />
            <van-field
                    v-model="number"
                    required
                    label="批号"
                    placeholder="请输入批号"
                    :rules="[{ required: true, message: '请输入批号' }]"
            />
        </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    <div v-show="!query">查询</div><van-loading size="24px" v-show="query">加载中...</van-loading>
                </van-button>
            </div>
        </van-form>
        <van-popup v-model:show="show" position="bottom" round>
        <van-picker ref="picker" :columns="columns" @change="onChange"
                    @cancel="show = false"
                    @confirm="onConfirm"
        />
        </van-popup>
        <objectcreate></objectcreate>
    </div>

</template>

<script>
import {reactive,toRefs,onUnmounted,onMounted,ref} from 'vue'
import instance from "@/http";
import { Dialog } from 'vant';
import objectcreate from "@/components/objectcreate";
import emitter from "@/event";
export default {
    components :{
        objectcreate
    },
    name: "querynumber",
    setup(){
        const state =reactive({
            query : false,
            show: false,
            brand : "",
            number : "",
            branddict :{hot: ['Ferragamo/菲拉格慕', 'A.H.C/爱和纯', 'First Aid Beauty/急救美人', 'ACQUA ALLE ROSE', 'The Face Shop/菲诗小铺', 'AERIN', 'Laura Mercier/罗拉玛希', 'AMPLEUR/阿芙乐尔', 'Chopard/萧邦', 'Ahava', 'Zara/飒拉', 'Alterna', 'Bottega Veneta/葆蝶家', 'Anastasia', 'Diptyque/蒂普提克', 'Aussie/澳丝', 'TIFFANY & CO./蒂芙尼', 'BY TERRY/泰芮', 'Byphasse/蓓昂斯', 'Becca'], A: ['A.H.C/爱和纯', 'ACQUA ALLE ROSE', 'AERIN', 'AMPLEUR/阿芙乐尔', 'Ahava', 'Alterna', 'Anastasia', 'Aussie/澳丝', 'Aesop/伊索', 'Albion/澳尔滨', 'Anna Sui/安娜苏', 'Anessa/安热沙', 'Acqua Di Parma/帕尔玛之水', 'AVEDA/艾梵达', 'Aveeno/艾惟诺', 'ARMAND BASI/阿曼贝丝', 'Avalon/阿瓦隆', 'Adidas/阿迪达斯', 'Aromatherapy Associates/雅容玛香薰之家', 'Avene/雅漾', 'AVON/雅芳', 'Aura Cacia', 'AZZARO/阿莎露', 'Alfred Sung/沈云门', 'Aramis/雅男士', 'antonio banderas', 'AXXZIA/奥仕妃', 'Antonio Puig', 'Angel Schlesser/安吉斯勒塞', 'Adolfo Dominguez/阿道夫·多明格斯', 'AEKYUNG/爱敬'], B: ['BY TERRY/泰芮', 'Becca', 'Boots/博姿', 'Burberry/博柏利', 'Bourjois/妙巴黎', 'Bvlgari/宝格丽', 'Balenciaga/巴黎世家', 'BONPOINT/朋博湾', 'Bobbi Brown/芭比波朗', 'Byredo/拜瑞朵', 'Blistex/百蕾适', 'Biore/碧柔', 'Biotherm/碧欧泉', 'Belif/碧研菲', 'Batiste/碧缇丝', 'Bifesta/缤若诗', 'Bottega Veneta/葆蝶家', 'Byphasse/蓓昂斯', 'Borghese/贝佳斯', 'Bioderma/贝德玛', 'Benefit/贝玲妃', 'bareMinerals/贝茗', 'Banana Boat/香蕉船', 'blanchirsuperior/馥兰皙儿', 'Blackmores/澳佳宝', 'BOUCHERON/宝诗龙', 'biosilk', 'Baldessarini', 'Blumarine', 'Bb LABORATORIES/苾莱宝', 'Balea/芭乐雅', 'BRODA PRO/博乐达'], C: ['CAMAY/卡玫尔', 'Catrice', 'Cerave/适乐肤', 'Cezanne/倩诗丽', 'Charlotte Tilbury', 'ColourPop', 'Cover FX', 'Creer Beaute', 'Cetaphil/丝塔芙', 'Canmake/井田', 'Clairol/伊卡璐', 'Clinique/倩碧', 'Christian Dior/克丽丝汀迪奥', 'California Baby/加州宝宝', 'Cartier/卡地亚', 'Calvin Klein/卡尔文克雷恩', 'Carolina Herrera/卡罗琳娜埃莱拉', 'club/可乐美', 'Clean & Clear/可伶可俐', 'Clarins/娇韵诗', 'Covergirl/封面女郎', 'CARMEX/小蜜媞', 'CHICCO/智高', 'Collistar/歌丽诗', 'Coppertone/水宝宝', 'Curel/珂润', 'Covermark/珂芙缦', 'Crabtree & Evelyn/瑰珀翠', 'CLARISONIC/科莱丽', 'Cle De Peau Beaute/肌肤之钥', 'Chopard/萧邦', 'Chloe/蔻依', 'Citreshine/闪露', 'Chanel/香奈儿', 'Chantecaille/香缇卡', 'Cosme Decorte/黛珂', 'CERRUTI/切瑞蒂', 'CHICCA', 'Christian Louboutin/克里斯提 鲁布托', 'COTY/科蒂', 'CARON/卡朗', 'CYCLAX/赛可莱思', 'cocochi cosme/可可琪可思曼', 'Cacharel/歌雪儿', 'COLORKEY/珂拉琪', 'COW/牛乳石碱'], D: ['Dkny', 'Drunk Elephant/醉象', 'DR.CI:LABO/城野医生', 'Dove/多芬', 'Daiso/大创', 'DAVIDOFF/大卫杜夫', 'dermafirm/德妃', 'Decleor/蒂可丽', 'Dermalogica/德美乐嘉', 'Dolce & Gabbana/杜嘉班纳', 'Diptyque/蒂普提克', 'DHC/蝶翠诗', 'Darphin/迪梵', 'diesel/迪塞尔', 'Decencia/黛世希', 'DELON'], E: ['E.L.F.', 'Embryolisse/恩倍思', 'Eve Lom', 'Elizabeth Arden/伊丽莎白雅顿', 'Etude House/伊蒂之屋', 'Eucerin/优色林', 'Erno Laszlo/奥伦纳素', 'est/嫒色', 'ELIXIR/怡丽丝尔', 'Elta MD/艾尔特梦迪', 'Ettusais/艾杜纱', 'Essie/艾汐', 'Estee Lauder/雅诗兰黛', 'Elegance/雅莉格丝', 'Elizabeth Taylor/伊丽莎白泰勒', 'escada/爱斯卡达'], 'F': ['FENDI/芬迪', 'Fissan', 'Frederic Fekkai', 'For Beloved One/宠爱之名', 'FEERIE VAN CLEEF & ARPELS/梵克雅宝', 'Freeplus/芙丽芳丝', 'Ferragamo/菲拉格慕', 'First Aid Beauty/急救美人', 'Fresh/馥蕾诗', 'Fenty Beauty', 'FILORGA/菲洛嘉', 'FANCL/芳珂', 'FARMACY'], 'G': ['Garnier/卡尼尔', 'Gucci/古驰', 'Glamglow/格莱魅', 'Goldwell/歌薇蒂仙', 'Guerlain/法国娇兰', 'Givenchy/纪梵希', 'Geoskincare/纽西之谜', 'Giorgio Armani/阿玛尼', 'Good Skin', 'GEOFFREY BEENE/哲非班利', 'gap'], 'H': ['H2O/水芝澳', 'HABA', 'HomeFacial Pro', 'Hugo Boss/雨果博斯', 'Hermes/爱马仕', 'Hadabisei/肌美精', 'Herbacin/贺本清', 'Helena Rubinstein/赫莲娜', 'hipitch/黑龙堂', 'Hourglass', 'Herbal Essences/植感哲学', 'Hada Labo/肌研'], 'I': ['IT COSMETICS', 'Issey Miyake/三宅一生', 'Impress/印象之美', 'Isdin/怡思丁', 'Innisfree/悦诗风吟', 'Ishizawa Labs/石泽研究所', 'Ipsa/茵芙莎', 'Isadora', 'inglot'], 'J': ['JMsolution/肌司研', 'Jill Stuart/吉尔斯图亚特', 'Jimmy Choo/吉米周', 'Juju/姿姿', 'JANSSEN/德赞臣', 'Judydoll/橘朵', 'Jurlique/茱莉蔻', 'Jo Malone London/祖·玛珑', 'Juicy Couture/橘滋', 'John Masters', 'jennifer lopez/詹尼弗洛佩兹', 'Jacques Bogart/积克宝格'], 'K': ['KIKO/奇蔻', 'KORRES/珂诺诗', 'Kate Somerville/凯诗薇', 'Kanebo/佳丽宝', 'KENZO/凯卓', 'Kate/凯朵', 'Kerastase/卡诗', 'Kiss Me/奇士美', 'KOBAYASHI/小林制药', 'Koh Gen Do/江原道', 'Kao/花王', 'Kose/高丝', 'Kenneth Cole/坚尼哥尔', "Kiehl's/科颜氏"], 'L': ['LIERAC/丽蕾克', 'Lolita Lempicka/洛俪塔', 'Lancaster/兰嘉丝汀', 'Laneige/兰芝', 'Lancome/兰蔻', 'Lipstick Queen/口红皇后', 'Lunasol/日月晶采', 'Lab Series/朗仕', 'Lacoste/来格仕', 'Lanvin/浪凡', 'La Mer/海蓝之谜', 'LION/狮王', 'La Roche-Posay/理肤泉', 'LOEWE/罗意威', 'Lalique/莱俪', 'La Prairie/莱珀妮', 'Laura Mercier/罗拉玛希', 'Laduree/拉杜丽', 'LilyBell/丽丽贝尔', 'LISSAGE', 'Liz claiborne/丽诗卡邦', 'Laura Biagiotti', 'Lime Crime', 'Lady Gaga', 'LOCCITANE/欧舒丹', '柳屋本店', 'LOSHI/露西'], 'M': ['MAVALA/美华丽', 'MILANI', 'Madonna/麦当娜', 'Molton Brown', 'Moschino/默斯奇诺', 'MontBlanc/万宝龙', 'Mama Mio', 'Murad/慕拉得', 'Muji/无印良品', 'Mandom/曼丹', 'Mamonde/梦妆', 'Mariannebolle/玛丽安保莱', 'MARY COHR/法国玛莉格', 'Milbon/玫丽盼', 'MAKE UP FOR EVER/玫珂菲', 'MIU MIU/缪缪', 'Mg/美即', 'Matrix/美奇丝', 'Maybelline/美宝莲', 'Marc Jacobs/莫杰', 'Max Factor/蜜丝佛陀', 'Mistine/蜜丝婷', 'Minon/蜜浓', 'Melvita/蜜葳特', 'Missha/谜尚', 'Michael Kors/迈克高仕', 'Matis/魅力匙', 'M.A.C/魅可', 'Moroccanoil', 'Mama&Kids/妈妈宝贝', 'MACADAMIA', 'Mentholatum/曼秀雷敦', 'MATSUYAMA/松山油脂'], 'N': ['NYR', 'Nars/娜斯', 'Nyx', 'Nina Ricci/丽娜蕙姿', 'Nivea/妮维雅', 'Naris/娜丽丝', 'Nursery/娜斯丽', 'Nuxe/欧树', 'nature republic/自然乐园', 'NARCISO RODRIGUEZ/纳西索 罗德里格斯', 'Neutrogena/露得清', 'NIOXIN', 'Natura Bisse/悦碧施'], 'O': ['OMI/近江蔓莎', 'OPI/傲碧爱', 'OSIAO', 'Omorovicza/欧微泉萨', 'Orbis/奥蜜思', 'Origins/悦木之源', 'OBAGI/欧邦琪', 'OLAY/玉兰油', 'Oshadhi/罗勒', 'Ojon', 'OPERA/娥佩兰'], 'P': ['Paris Hilton', 'Physicians Formula', 'Piz Buin', 'Phyto/发朵', 'Perfect Diary/完美日记', 'POLA/宝丽', 'Paul Mitchell/宝美奇', 'Peter Thomas Roth/彼得罗夫', 'Prada/普拉达', 'Payot/栢姿', 'Paul & Joe/欧乐菊', 'Pantene/潘婷', 'PDC/碧迪皙', 'Philosophy/肌肤哲理', 'Pigeon/贝亲', 'Perlier/培礼雅', 'PUREOLOGY', 'Paloma Picasso/毕加索', 'Paul Smith/保罗史密斯', 'PUMA/彪马', 'PRESCRIPTIVES', 'Paco Rabanne/帕科', 'PUPA', 'playboy', 'Phat Farm/酷农场', 'Paul Sebastian', "PAULA'S CHOICE/宝拉珍选"], 'Q': ['QUALITY FIRST/凯丽芙', 'Queen Helene/海伦皇后', 'Queen Latifah/奎因·拉蒂法'], 'R': ['RAFRA', 'ROBERTO CAVALLI/罗伯托卡沃利', 'Radox', 'Ren/芢', 'Rmk', 'Rohto/乐敦', 'Ralph Lauren/拉夫劳伦', 'RED EARTH/红地球', 'Rexona/舒耐', 'Revive/芮维芙', 'Rimmel/芮谜', 'Revlon/露华浓', 'Roger & Gallet/香邂格蕾', 'Rene Furterer/馥绿德雅', 'Roberto Verino/罗伯特薇薇', 'REDKEN', 'Rochas/巴黎罗莎', 'Replay/重温', 'Rosette/露姬婷', 'RCMA'], 'S': ['SK-Ⅱ', 'SNOWBERRY/雪果庄园', 'Skin79', 'Stridex/施颜适', 'Suqqu', 'Swisse/丝维诗', 'smashbox', 'Sephora/丝芙兰', 'Skinceuticals/修丽可', 'Sisley/希思黎', 'Skin Food/思亲肤', 'Stila/思迪拉', 'Somang/所望', 'swarovski/施华洛世奇', 'Schwarzkopf/施华蔻', 'Shu Uemura/植村秀', 'Sofina/苏菲娜', 'Sana/莎娜', 'Shiseido/资生堂', 'Sekkisei/雪肌精', 'Sulwhasoo/雪花秀', 'SERGE LUTENS/芦丹氏', 'SEAN JOHN', 'Superdry/极度干燥', 'S.T. Dupont', 'Shakira', 'SPA TREATMENT/思派雅'], 'T': ['TOMMY HILFIGER', 'TATCHA', 'The Balm', 'The Ordinary', 'Three', 'The History Of Whoo/后', 'Talika/塔莉卡', 'Taiyosha/太阳社', 'Tonymoly/托尼魅力', 'Tom Ford/汤姆·福特', 'The Body Shop/美体小铺', 'The Face Shop/菲诗小铺', 'TIFFANY & CO./蒂芙尼', 'Too Faced', 'THE GINZA/御银座', 'TWANY', 'TAKAMI/高美蓝'], 'U': ['Urban Decay/衰败城市', 'Utena/佑天兰', 'Uriage/依泉', 'Uno/吾诺', 'Unny Club/悠宜'], 'V': ['Vaseline/凡士林', 'VALENTINO/华伦天奴', 'Valmont/法儿曼', 'Versace/范思哲', 'Vanicream/薇霓肌本', 'VISEE', 'VIKTOR & ROLF/维克多与罗夫', 'VICHY/薇姿'], 'W': ['W.LAB/大福留', 'Wakodo/和光堂', 'Wella/威娜', 'WINONA/薇诺娜'], 'Y': ['Yves Rocher/伊夫黎雪', 'Yves Saint Laurent/圣罗兰'], 'Z': ['ZELENS', 'Zirh/瑟雅', 'ZOTOS ACCENT/姬芮', 'Zara/飒拉', 'zoeva']},

        })
        const picker = ref(null);
        const columns = [
            { values: Object.keys(state.branddict) },
            { values: state.branddict['hot'] }]
        const onChange = (values) => {
            console.log(values)
            picker.value.setColumnValues(1, state.branddict[values[0]]);
        };
        const onClickLeft = () => history.back();
        const onConfirm =(value)=>{
            console.log(value);
            state.brand = value[1];
            state.show =false;
        }
        const onSubmit=()=>{
            if (state.query===false){
                state.query = true;
                instance.post("/lotno",{
                    'brand' : state.brand,
                    'number' :state.number
                }).then(res =>{
                    state.query = false;
                    dialog(res.data.data)
                }).catch(function (error) {
                    state.query = false;
                    Dialog.alert({
                        title: '错误',
                        message: '服务器错误，请稍后再试',
                    }).then(() => {
                    });
                    console.log(error.message);
                });
                setTimeout(()=>{
                    state.query = false
                },10000)
            }

        }
        const dialog =(data)=>{
            if (data==="未找到相关记录"){
                Dialog.alert({
                    title: '查询结果',
                    message: '未找到相关记录',
                }).then(() => {
                    // on close
                });
                state.query = false;
            }
            else {
                Dialog.confirm({
                    title: '查询结果',
                    confirmButtonText: '添加',
                    message:
                        '品牌：'+state.brand+'\n'+'批号：'+state.number+'\n'+'生产日期：'+data.manufacture_time+'\n'+'过期日期：'+data.expiration_time+'\n',
                })
                    .then(() => {
                        let t = {
                            "information" : state.brand,
                            "expiration_time" : data.expiration_time,
                            "manufacture_time" : data.manufacture_time,
                        }
                        emitter.emit("objectcreate",t)
                    })
                    .catch(() => {
                        // on cancel
                    });
            }

        }
        return{
            ...toRefs(state),
            onClickLeft,
            columns,
            picker,
            onChange,
            onConfirm,
            onSubmit
        }
    }
}
</script>

<style scoped>

</style>