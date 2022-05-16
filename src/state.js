import moment from "moment";
export default function states(e_time,r_time) {

    var e = moment(e_time);
    var r = moment(r_time);
    var t = moment();
    if (e.diff(t,"days")<0) return "已过期"
    else if (r.diff(t,"days")<0) return "临近过期"
    else return "最佳"
}