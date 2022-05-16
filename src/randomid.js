export default function generateMixed() {

        var str = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var res = "";
        for(var i = 0; i < 128 ; i ++) {
            var id = Math.ceil(Math.random()*25);
            res += str[id];
        }
        return res;

}