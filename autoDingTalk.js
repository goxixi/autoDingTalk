// author: gcx
// breif: 这是一个用于自动打卡的脚本，需要配合auto.js使用
//        请在钉钉中设置定时任务以每天固定时间运行该脚本

var randomSleepMinutes = 10;
var keepScreenOnMinutes = 15;
var swipeStartX = 539;
var swipeStartY = 1918;
var swipeEndX = 539;
var swipeEndY = 500;
var swipeSpeed = 300;

// 钉钉密码
var dingTalkPassword = "xxx";
// 接收打卡结果的邮箱地址
var emailAddress = "xxx@qq.com"

var is_sendEmail = true;
var is_openAirDroid = true;


// auto.js定时任务每天在确定时间开启脚本，再添加一个随机的延时，避免每天打卡时间都一样
var delay_time = random(0, randomSleepMinutes * 60 * 1000);
console.log("delay time: " + delay_time / 1000 + "s");
sleep(delay_time);

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
home();
device.cancelKeepingAwake(); // 取消设备常亮


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
    sleep(10 * 1000);

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
}

function sendEmail() {
    console.log("send email");

    // 打开邮件app
    launchApp("网易邮箱大师");
    console.log("opening the mail app")
    sleep(15 * 1000);
    
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
    id("img_send_bg").findOne().click();
    sleep(1000);
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