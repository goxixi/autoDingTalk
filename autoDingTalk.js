// author: gcx
// breif: this is a demo script for dingtalk punch in
//        please set it as a scheduled task in your phone("定时任务")

var randomSleepMinutes = 10;
var keepScreenOnMinutes = 15;
var swipeStartX = 539;
var swipeStartY = 1918;
var swipeEndX = 539;
var swipeEndY = 500;
var swipeSpeed = 300;

var dingTalkPassword = "xxx";
var emailAddress = "xxx@qq.com"

// set a random sleep time to avoid the same punch in time
var sleep_time = random(0, randomSleepMinutes * 60 * 1000);
console.log("delay time: " + sleep_time / 1000 + "s");
// sleep(sleep_time);

initial();
var date = new Date();
var currentTime = date.toLocaleString();
console.log(currentTime);
var cur_hour = date.getHours();
var cur_minute = date.getMinutes();

punchIn();
console.log("here");
sendEmail();
home();


function initial() {
    // wake up the phone 
    if (!device.isScreenOn()) {
        device.wakeUp();
        sleep(3 * 1000);
        console.log("wake up");
        // swipe to unlock the phone    
        swipe(swipeStartX, swipeStartY, swipeEndX, swipeEndY, swipeSpeed);
        sleep(3 * 1000);
    }
    
    // keep the screen on
    device.keepScreenOn(keepScreenOnMinutes * 60 * 1000);
}

function punchIn() {
    // open the dingtalk
    console.log("open dingtalk")
    launchApp("钉钉");
    console.log("opening dingTalk")
    sleep(10 * 1000);

    // check whether it has been logined and login if not login yet
    if(id("user_avatar_login_tv").exists()) {
        console.log("not login yet");
        id("et_password").findOne().setText(dingTalkPassword);
        sleep(1000);
        id("cb_privacy").findOne().click()
        sleep(1000);
        id("btn_next").findOne().click()
    }


    quickSettings();
    sleep(1000);
    click(546, 1340);
    sleep(500);
    swipe(swipeStartX, swipeStartY, swipeEndX, swipeEndY, swipeSpeed);
    sleep(6 * 1000);
}

function sendEmail() {
    console.log("send email");

    launchApp("网易邮箱大师");
    console.log("opening the mail app")
    sleep(10 * 1000);
    
    if(id("fab_compose").exists()) {
        console.log("fab_compose exists");
        id("fab_compose").findOne().click();
        sleep(3 * 1000);
    }

    id("input").findOne().setText(emailAddress)
    sleep(1000);
    var subject = currentTime + " punch in result";
    id("et_subject").findOne().setText(subject)
    sleep(1000);
    id("compose_edit").findOne().click();
    sleep(1000);
    id("iv_insert_img").findOne().click();
    sleep(1000);
    click(370, 1500);
    sleep(1000);
    id("tv_choose_photo_complete").findOne().click();
    sleep(1000); 
    id("img_send_bg").findOne().click();
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