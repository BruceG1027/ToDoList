$(function() {
    // 待办事项模块
    (function toDoListModule() {
        load(); // 现将原有的数据渲染到页面上
        // 按下回车，提交内容模块
        $("#title").on("keydown", function(event) {
            if (event.keyCode === 13) {
                if ($(this).val() === "") {
                    alert("请输入内容");
                } else {
                    //读取本地的数据
                    let local = getData();
                    //将输入的内容加入数组中
                    local.push({ title: $(this).val(), done: false});
                    // 将数组存储到本地存储
                    saveData(local);
                    //将数据渲染到页面上
                    load();
                    //清空输入框
                    $(this).val("");
                }
            }
        });

        // 删除模块
        $("ol,ul").on("click", "a", function() {
            let data = getData();
            let index = $(this).attr("id");
            data.splice(index, 1);
            saveData(data);
            load();
        })

        // 进行完成转换模块
        $("ol,ul").on("click", "input", function() {
            // 获取数据
            let data = getData();
            // 修改数据
            let index = $(this).siblings("a").attr("id");
            data[index].done = $(this).prop("checked");
            // 保存并渲染
            saveData(data);
            load();
        })


        // 获取本地存储中的数据
        //? 这里有bug，当 localStorage 中是 undefined 时，无法使用parse函数
        function getData() {
            let data = localStorage.getItem("todolist");
            if(data!==null) {
                return JSON.parse(data);
            } else {
                return [];
            }
        }

        // 将data保存到本地存储中
        function saveData(data) {
            localStorage.setItem("todolist",JSON.stringify(data));
        }

        // 将本地存储中的内容渲染到页面上
        function load() {
            let data = getData();
            // console.log(data);
            // 遍历前先清空
            $("ol,ul").empty();
            let todoCount = 0;
            let doneCount = 0;
            // 遍历
            $.each(data, function(i,n) {
                if (n.done) {
                    $('#donelist').prepend("<li><input type='checkbox'><p>" + n.title + "</p> <a href='javascript:;' id="+ i +"></a></li>");
                    doneCount++;
                } else {
                    $('#todolist').prepend("<li><input type='checkbox'><p>" + n.title + "</p> <a href='javascript:;' id="+ i +"></a></li>");
                    todoCount++;
                }
            })
            $("#todocount").text(todoCount);
            $("#donecount").text(doneCount);

        }
    })();


    // 时间模块 
    (function timeModule() {
        let nowTime = new Date();
        // console.log(nowTime);
        let year = nowTime.getFullYear() < 10? "0" + nowTime.getFullYear() : nowTime.getFullYear();
        let month = (nowTime.getMonth()+1) < 10? "0" + nowTime.getMonth()+1 : nowTime.getMonth()+1;
        let date = nowTime.getDate() < 10? "0" + nowTime.getDate() : nowTime.getDate();
        let day = nowTime.getDay();
        switch(day) {
            case 0: day = "星期日"; break;
            case 1: day = "星期一"; break;
            case 2: day = "星期二"; break;
            case 3: day = "星期三"; break;
            case 4: day = "星期四"; break;
            case 5: day = "星期五"; break;
            case 6: day = "星期六"; break;
        } // 星期模块
        let hour = nowTime.getHours();
        let halfDay = "凌晨";
        if (hour >= 5 && hour < 12) {
            halfDay = "上午";
        } else if (hour >= 12 && hour < 14) {
            halfDay = "中午";
        } else if (hour >= 14 && hour < 17) {
            halfDay = "下午";
        } else if (hour >= 17 && hour < 19) {
            halfDay = "傍晚";
        } else if (hour >= 19 && hour <= 23) {
            halfDay = "晚上";
        } 
        $(".year").html(year);
        $(".month").html(month);
        $(".date").html(date);
        $(".day").html(day);
        $(".halfday").html(halfDay);
    })(); //* 采用函数表达式，立即执行也不用变量接收，使代码更工整


    // 计时器模块
    (function countModule() {
        let myCount = (function () {
            let myInterval = null, isCount = 0, step = 0; // 初始化，myInterval 定时器，isCount 是否在计时中，step 秒数

            function count () {
                let h = parseInt((step / 60 / 60) % 24);
                h = h < 10 ? "0" + h : h;
                $('.hour').html(h);
                let m = parseInt((step / 60) % 60);
                m = m < 10 ? "0" + m : m;
                $('.minute').html(m);
                let s = parseInt(step % 60);
                s = s < 10 ? "0" + s : s;
                $('.second').html(s);
                step = step + 1;
            } // 计数函数，并渲染页面

            function start() {
                isCount = 1;
                count();
                myInterval = setInterval(count, 1000);
                $(this).attr('disabled', 'disabled');
                $('#restart').attr('disabled', 'disabled');
                $('#pause').removeAttr('disabled');
            } // 开始函数

            function stop() {
                if (isCount) {
                    clearInterval(myInterval);
                    isCount = 0;
                }
            } // 计时器停止函数

            function pause() {
                if (isCount) {
                    stop();
                    $('#start').removeAttr('disabled').html('继续');
                    $('#pause').attr('disabled', 'disabled');
                    $('#restart').removeAttr('disabled');
                }

            } // 暂停函数

            function restart() {
                if ($('#pause').attr('disabled') == 'disabled') {
                    stop();
                    step = 0;
                    {count();
                    step = step - 1;} //消除 count() 最后一步的影响
                    $(this).attr('disabled', 'disabled');
                    $('#start').html('开始');
                }
            } // 复位函数

            return {
                startCount: start,
                pauseCount: pause,
                restartCount: restart
            }
        })() //* 这里采用了函数表达式 fun(){}() 的形式，返回一个对象，三个函数

        $('#start').on('click', myCount.startCount); //*这里函数的调用方法要注意
        $('#pause').on('click', myCount.pauseCount);
        $('#restart').on('click', myCount.restartCount);
    })(); //* 采用函数表达式，立即执行也不用变量接收，使代码更工整

}) 