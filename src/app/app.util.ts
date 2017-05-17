import { SQLite } from 'ionic-native';
import {ApiConfig} from './api.config';

export class AppUtil {
	
    public static HtmlDecode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");

        s = s.replace("\"/alucard263096/newsapp/upload/", "\""+ApiConfig.getUploadPath());
        return s;
    }

    public static Toast(toastCtrl,msg) {
        let toast = toastCtrl.create({
            message: msg
        });
        toast.present();
    }

    public static FormatDateTime(val: Date) {
        return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate() +
            " " + val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();
    }

    public static IsMobileNo(str){

        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return myreg.test(str);
    }
    public static FormatPercent(val) {
        val = val * 100.0;
        return val.toFixed(2) + '%';
    }
    public static FormatPrice(val) {
        val = val * 1.0;
        return val.toFixed(2);
    }
    public static FormatNumber(val, digits) {
        val = val * 1.0;
        return val.toFixed(digits);
    }
    public static FormatDate(val) {
        return val.substr(0, 10);
    }
    public static Storage = null;

    
}