(function () {
    for(var i = 1; i < 1000; i++) {
        clearInterval(i);
    }
    var realDate = new Date();
    var startDate = new Date(realDate.getFullYear() + "-" + (realDate.getMonth()+1) + "-" + realDate.getDate() + " 09:29:01");
    var baidu = A.baidu,
        _this = this,
        getServerTime, drawBackground, drawMark, drawHands, STAR_NUM = 200,
        TIME_ZONE = 8,
        now, countTimeZone, timeZone = 8,
        ensureTime, bjConmunu, dst = null,
        countDayLight, dayLight = {"start":"8:00:00","end":"20:00:00"},
        dayLightStatus, secondTimer, minuteTimer, timeFormat, setDateTime, dateSetter, contextFlag, contextEvent,
        initialize, initForIE, hourTime = 36e5,
        supportCanvas = !! document.createElement("canvas").getContext,
        $container = $(".op-beijingtime"),
        bgCanvas, markCanvas, handsCanvas;
    if (countTimeZone = function (time, timeZone) {
            var curZone = time.getTimezoneOffset(),
                curDate, month, day, hour;
            if (curDate = new Date(time.getTime() + 6e4 * curZone), curDate.setTime(curDate.getTime() + timeZone *
                    hourTime), dst) if (new Date(curDate.year, dst.month - 1, dst.day, dst.hour, 0, 0) < curDate && new Date(
                    curDate.year, dst.endMonth - 1, dst.endDay, dst.endHour, 0, 0)) curDate.setTime(curDate.getTime() +
                hourTime);
            return curDate
        }, ensureTime = function (time, timeZone) {
            var curTimezone = time.getTimezoneOffset();
            return new Date(time.getTime() + 6e4 * (time.getTimezoneOffset() - timeZone))
        }, getServerTime = function (callback) {
            function oncallback(jqXHR) {
                var time = jqXHR && jqXHR.getResponseHeader("Date");
                if (time) callback(new Date(time))
            }
            if ("function" == typeof callback) $.ajax({
                url: "//www.baidu.com/nocache/fesplg/time.gif ",
                type: "HEAD"
            }).done(function (data, textStatus, jqXHR) {
                oncallback(jqXHR)
            }).fail(function (jqXHR, textStatus, errorThrown) {
                oncallback(jqXHR)
            })
        }, setDateTime = function (date, time) {
            var t = time.split(":");
            return date.setHours(t[0]), date.setMinutes(t[1] || 0), date.setSeconds(t[2] || 0), date
        }, countDayLight = function () {
            var startTime = dayLight.start,
                endTime = dayLight.end;
            return startTime = setDateTime(new Date(now.getTime()), startTime), endTime = setDateTime(new Date(now.getTime()),
                endTime), startTime < now && endTime > now ? "daylight" : "night"
        }, drawBackground = function (isNight) {
            var ctx = bgCanvas.getContext("2d"),
                width = bgCanvas.offsetWidth,
                height = bgCanvas.offsetHeight,
                grd, drawStar;
            if (!dayLightStatus || dayLightStatus != isNight) {
                if (dayLightStatus = isNight, ctx.clearRect(0, 0, width, height), drawStar = function () {
                        var i, x, y, radGrd, radius, startColor, opacity, unit;
                        for (unit = supportCanvas ? 1 : .5, i = 0; i < STAR_NUM; i++) x = Math.random() * width, y = Math.random() *
                            height, radius = Math.random() + unit, opacity = radius - unit, supportCanvas && (opacity /=
                            2), radGrd = ctx.createRadialGradient(x, y, 1, x, y, radius), radGrd.addColorStop(0,
                            "rgba( 175, 175, 175, " + opacity + " )"), radGrd.addColorStop(1,
                            "rgba( 175, 175, 175, 0 )"), ctx.fillStyle = radGrd, ctx.beginPath(), ctx.arc(x, y, radius,
                            0, 2 * Math.PI, true), ctx.fill(), ctx.closePath()
                    }, isNight) grd = ctx.createLinearGradient(0, 0, 0, height), grd.addColorStop(0, "rgb(24, 50, 89)"),
                    grd.addColorStop(1, "rgb(52, 130, 186)");
                else grd = ctx.createLinearGradient(0, 0, 0, height), grd.addColorStop(0, "#0067bf"), grd.addColorStop(
                    1, "#6eabe2"); if (ctx.fillStyle = grd, ctx.fillRect(0, 0, width, height), isNight) drawStar()
            }
        }, drawMark = function () {
            var ctx = markCanvas.getContext("2d"),
                i, lineLength, radius = markCanvas.offsetWidth / 2;
            for (ctx.translate(radius, radius), i = 0; i < 60; i++) {
                if (ctx.lineWidth = 1, ctx.strokeStyle = "rgba( 255, 255, 255, 0.3 )", lineLength = 4, i % 5 == 0)
                    lineLength = 8, ctx.strokeStyle = "#fff";
                ctx.beginPath(), ctx.moveTo(0, lineLength - radius), ctx.lineTo(0, -radius), ctx.stroke(), ctx.closePath(),
                    ctx.rotate(Math.PI / 30)
            }
        }, drawHands = function (date) {
            var hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds(),
                ctx = handsCanvas.getContext("2d"),
                radius = handsCanvas.offsetWidth / 2,
                draw;
            hour > 12 && (hour -= 12), hour += minute / 60, minute += second / 60, ctx.clearRect(0, 0, 2 * radius, 2 *
                radius), draw = function (lineWidth, strokeStyle, rotate, start, end) {
                ctx.save(), ctx.lineWidth = lineWidth, ctx.strokeStyle = strokeStyle, ctx.translate(radius, radius),
                    ctx.rotate(rotate), ctx.beginPath(), ctx.moveTo(0, start), ctx.lineTo(0, end), ctx.stroke(), ctx.closePath(),
                    ctx.restore()
            }, draw(3, "#fff", Math.PI / 6 * hour, 6, -16), draw(2, "#fff", Math.PI / 30 * minute, 6, -24), draw(1,
                "#d93c3c", Math.PI / 30 * second, 6, -24)
        }, timeFormat = function (str) {
            return ("0" + str).slice(-2)
        }, dateSetter = {
            time: null,
            week: null,
            date: null,
            init: function () {
                this.time = $(".op-beijingtime-time")[0], this.week = $(".op-beijingtime-week")[0],
                    this.date = $(".op-beijingtime-date")[0], this.setTime(), this.minuteSet()
            },
            setTime: function () {
                this.time.innerHTML = timeFormat(now.getHours()) + "<span>:</span>" + timeFormat(now.getMinutes()) +
                    '<span class="op-beijingtime-small c-gap-left">' + timeFormat(now.getSeconds()) + "</span>"
            },
            setWeek: function () {
                this.week.innerHTML = "星期" + "日一二三四五六".charAt(now.getDay())
            },
            setDate: function () {
                this.date.innerHTML = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日"
            },
            minuteSet: function () {
                this.setWeek(), this.setDate()
            }
        }, minuteTimer = function (time) {
            now = countTimeZone(time, timeZone), dateSetter.minuteSet(), drawBackground("night" == countDayLight())
        }, bjConmunu = function () {
            contextFlag = true
        }, contextEvent = function () {
            $(document).bind("contextmenu", bjConmunu)
        }, initialize = function () {
            var tpl =
                '<canvas class="op-beijingtime-background" width="#{width}" height="100"></canvas>            <div class="op-beijingtime-box c-clearfix">                <canvas class="op-beijingtime-hands" width="65" height="65"></canvas>                <canvas class="op-beijingtime-mark" width="65" height="65"></canvas>                <p class="op-beijingtime-time"></p>                <p class="op-beijingtime-datebox"><span class="op-beijingtime-week"></span><span class="op-beijingtime-date"></span>            </div>';
            if ($container.html($.format(tpl, {
                    width: $container.width()
                })), bgCanvas = $(".op-beijingtime-background")[0], markCanvas = $(".op-beijingtime-mark")[
                    0], handsCanvas = $(".op-beijingtime-hands")[0], !supportCanvas) A.ui.canvas.init([bgCanvas,
                markCanvas, handsCanvas]);


                now = startDate, contextEvent(), now = countTimeZone(now, timeZone), drawBackground("night" ==
                    countDayLight()), drawMark(), drawHands(now), dateSetter.init(), secondTimer = window.setInterval(function () {
                    var timeObj, timezone;
                    if (0 == now.getSeconds() || true == contextFlag) minuteTimer(now), contextFlag = false;
                    if (timezone = now.getTimezoneOffset(), now = new Date(now.getTime() + 1e3), now.getTimezoneOffset() !=
                        timezone) now = ensureTime(now, timezone);
                    drawHands(now), dateSetter.setTime()
                }, 1e3)


        }, supportCanvas) initialize();
    else A.use("canvas", function () {
        initialize()
    });

})();