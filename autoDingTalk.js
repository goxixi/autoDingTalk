// author: gcx
// breif: 这是一个用于自动打卡的脚本，需要配合auto.js使用
//        请在钉钉中设置定时任务以每天固定时间运行该脚本

var randomSleepMinutes = 10;
var keepScreenOnMinutes = 20;
var swipeStartX = 539;
var swipeStartY = 1918;
var swipeEndX = 539;
var swipeEndY = 500;
var swipeSpeed = 300;

// 钉钉密码
var dingTalkPassword = "xxx";
// 接收打卡结果的邮箱地址
var emailAddress = "xxx@qq.com"

var test_mode = false;   // 测试模式
var is_sendEmail = true;
var is_openAirDroid = true;


// auto.js定时任务每天在确定时间开启脚本，再添加一个随机的延时，避免每天打卡时间都一样
var delay_time = random(0, randomSleepMinutes * 60 * 1000);
console.log("delay time: " + delay_time / 1000 + "s");
if(!test_mode) {
    sleep(delay_time);
}

initial();
var date = new Date();
var currentTime = date.toLocaleString();
console.log(currentTime);
var cur_hour = date.getHours();
var cur_minute = date.getMinutes();

punchIn();
console.log("here");
if (is_sendEmail) {
    sendEmail();
}
if (is_openAirDroid) {
    launchApp("AirDroid");
    sleep(10 * 1000);
}
if(!test_mode) {
    sleep(10 * 60 * 1000);
}
home();
// device.cancelKeepingAwake(); // 取消设备常亮


function initial() {
    // 唤醒手机
    if (!device.isScreenOn()) {
        device.wakeUp();
        sleep(3 * 1000);
        console.log("wake up");
        // 上滑解锁   
        swipe(swipeStartX, swipeStartY, swipeEndX, swipeEndY, swipeSpeed);
        sleep(3 * 1000);
    }
    
    // 保持手机在一段时间内亮屏
    device.keepScreenOn(keepScreenOnMinutes * 60 * 1000);
}

function punchIn() {
    // 打开钉钉
    console.log("open dingtalk")
    launchApp("钉钉");
    console.log("opening dingTalk")
    sleep(15 * 1000);

    // 检查钉钉是否已经登录，如果没有登录，就登录
    if(id("user_avatar_login_tv").exists()) {
        console.log("not login yet");
        id("et_password").findOne().setText(dingTalkPassword);
        sleep(1000);
        id("cb_privacy").findOne().click()
        sleep(1000);
        id("btn_next").findOne().click()
    }

    // 下滑状态栏，点击截屏工具截屏
    quickSettings();
    sleep(1000);
    click(546, 1340);
    sleep(500);
    swipe(swipeStartX, swipeStartY, swipeEndX, swipeEndY, swipeSpeed);
    sleep(6 * 1000);

    // 发送邮件后关闭钉钉，以减少内存占用
    killApp("钉钉");
}

function sendEmail() {
    console.log("send email");

    // 打开邮件app
    launchApp("网易邮箱大师");
    console.log("opening the mail app")
    sleep(20 * 1000);
    
    if(id("fab_compose").exists()) {
        console.log("fab_compose exists");
        id("fab_compose").findOne().click();
        sleep(3 * 1000);
    }
    // 输入收件人地址
    id("input").findOne().setText(emailAddress)
    sleep(1000);
    // 输入主题
    var subject = currentTime + " punch in result";
    id("et_subject").findOne().setText(subject)
    sleep(500);
    // 输入正文
    id("compose_edit").findOne().click();
    sleep(500);
    // 选择截屏图片
    id("iv_insert_img").findOne().click();
    sleep(1000);
    click(370, 1500);
    sleep(1000);
    id("tv_choose_photo_complete").findOne().click();
    sleep(1000);
    // 发送邮件
    if(!test_mode) {
        id("img_send_bg").findOne().click();
    }
    sleep(2000);

    // 发送邮件后关闭邮箱app，以减少内存占用
    killApp("网易邮箱大师");
}

//判断网络情况，如果没有网络，结束脚本运行
function internetCheck() {
    var url = "m.baidu.com";
    var res = http.get(url);
    if (res.statusCode != 200) {
      console.error("网络不可用，无法打卡");
      exit();
    }
  }
  
//判断GPS是否可用，如果不可用，结束脚本运行
function gpsCheck() {
    importClass(android.location.LocationManager);
    importClass(android.content.Context);
    var locationManager = context.getSystemService(Context.LOCATION_SERVICE);
    if (!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
        console.error("GPS不可用，无法打卡");
        exit();
    }
    // TODO(GCX) : 若校园网需要重新登录，则进行重新登录
}
  
  
//根据控件文字点击，如果点击失败，则说明打卡流程无法正常进行，结束脚本运行
function clickMessage(message) {
    var n = 3;
    var logo = false;
    while (n--) {
        if (click(message)) {
        logo = true;
        break;
        }
        sleep(3 * 1000);
    }
    if (logo == false) {
        console.error("点击" + message + "出错");
        // exit();
    }
}


/*
————————————————
版权声明：本文为CSDN博主「咸散人士」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/weixin_44786692/article/details/125469745
*/
function killApp(appName) {//填写包名或app名称都可以
    var name = getPackageName(appName);//通过app名称获取包名
    if(!name){//如果无法获取到包名，判断是否填写的就是包名
        if(getAppName(appName)){
            name = appName;//如果填写的就是包名，将包名赋值给变量
        }else{
            return false;
        } 
    }

    app.openAppSetting(name);//通过包名打开应用的详情页(设置页)
    // text(app.getAppName(name)).waitFor();//通过包名获取已安装的应用名称，判断是否已经跳转至该app的应用设置界面
    sleep(100);//稍微休息一下，不然看不到运行过程，自己用时可以删除这行
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*)/).findOne();//在app的应用设置界面找寻包含“强”，“停”，“结”，“行”的控件
    // let is_sure = textMatches("强行停止").findOne();//在app的应用设置界面找寻包含“强”，“停”，“结”，“行”的控件
    //特别注意，应用设置界面可能存在并非关闭该app的控件，但是包含上述字样的控件，如果某个控件包含名称“行”字
    //textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/)改为textMatches(/(.*强.*|.*停.*|.*结.*)/)
    //或者结束应用的控件名为“结束运行”直接将textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/)改为text("结束运行")

    if (is_sure.enabled()) {//判断控件是否已启用（想要关闭的app是否运行）
        is_sure.click();//结束应用的控件如果无法点击，需要在布局中找寻它的父控件，如果还无法点击，再上一级控件，本案例就是控件无法点击
        
        textMatches(/(.*确.*|.*定.*)/).findOne().click();//需找包含“确”，“定”的控件
        log(app.getAppName(name) + "应用已被关闭");
        sleep(1000);
        back();
    } else {
        log(app.getAppName(name) + "应用不能被正常关闭或不在后台运行");
        back();
    }
}
