module.exports = {
    //防止注入
    filterString: function(str) {
        var re = /select|update|delete|truncate|join|union|exec|insert|drop|count|’|"|;|>|<|%/i;
        return re.test(str) ? false : true;
    },
    //模板替换
    substitute: function(str, object) {
        return str.replace(/\\?\{([^}]+)\}/g, function(match, name) {
            if (match.charAt(0) == '\\') return match.slice(1);
            return (object[name] != undefined) ? object[name] : '';
        });
    },
    //剔除指定数组元素
    removeElem: function(a, e) {
        if (a.indexOf(e) != -1) {
            var id = a.indexOf(e);
            a.splice(id, 1);
        }
    },
    //补0
    fill: function(num) {
        var str = num + "";
        if (num < 10) str = "0" + num;
        return str;
    },
    //获取年月日时分秒 如：2014-6-25 17:55:32
    getTime: function() {
        var dt = new Date();
        var str = dt.getFullYear() + "/" +
            this.fill(Number(dt.getMonth() + 1)) + "/" +
            this.fill(dt.getDate()) + "" +
            this.fill(dt.getHours()) + ":" +
            this.fill(dt.getMinutes()) + ":" +
            this.fill(dt.getSeconds());
        return str;
    }
}
