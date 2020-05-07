/**
 * 接口配置文件
 */
const ONLINEBASEURL = window.g.url;
//用户相关
const LOGIN = `${ONLINEBASEURL}/login/verifyforadmin`  //用户名密码登录
const CHANGE_PASSWORD = `${ONLINEBASEURL}/userworker/setpassword`  //修改密码
const USER_LIST = `${ONLINEBASEURL}/userworker/getlist`  //用户列表
const USER_ADD = `${ONLINEBASEURL}/userworker/add`  //用户增加
const USER_GETONE = `${ONLINEBASEURL}/userworker/getone`  //用户获取详情
const USER_UPDATE = `${ONLINEBASEURL}/userworker/update`  //用户编辑
const USER_CLEARPWD = `${ONLINEBASEURL}/userworker/passclear`  //用户重置密码
const USER_DELETE = `${ONLINEBASEURL}/userworker/del`  //用户重置密码

//AI预警页面
const AI_LIST = `${ONLINEBASEURL}/alarm/getlist_AI`  //AI预警列表

//数据看板页面
const HOME_INFO = `${ONLINEBASEURL}/homeinfo/getinfo_e` // 企业总数、累计抽查、完成率
const HOME_INFO_TIME = `${ONLINEBASEURL}/homeinfo/getinfo_realtime` // 当日数据
const HOME_INFO_RANK = `${ONLINEBASEURL}/homeinfo/getinfo_company`  //学校预警排序
const MAPSCHOOL=`${ONLINEBASEURL}/company/getlist_all`;//学校点位展示

// 企业设备页面（企业）
const CompanyGetlist = `${ONLINEBASEURL}/company/getlist`  //企业列表
const CompanyGetlistAll = `${ONLINEBASEURL}/company/getlist_all`  //所属值守
const CompanyAdduser = `${ONLINEBASEURL}/company/adduser`  //添加企业
const CompanyGetone = `${ONLINEBASEURL}/company/getone`  //获取单条企业
const CompanyUpdate = `${ONLINEBASEURL}/company/update`  //编辑企业
const CompanyDel = `${ONLINEBASEURL}/company/del`  //删除企业
// 企业设备页面（设备）
const CameraGetlist = `${ONLINEBASEURL}/camera/getlist`  //设备列表
const CameraAdd = `${ONLINEBASEURL}/camera/add`  //设备添加
const CameraGetone = `${ONLINEBASEURL}/camera/getone`  //设备获取单条
const CameraUpdate = `${ONLINEBASEURL}/camera/update`  //设备修改
const CameraDel = `${ONLINEBASEURL}/camera/del`  //设备删除
// 审核处理页面
const AlarmGetlist = `${ONLINEBASEURL}/alarm/getlist`  //审核处理列表
const AlarmGetone = `${ONLINEBASEURL}/alarm/getone`  //审核处理详情


module.exports = {
    LOGIN, CHANGE_PASSWORD, USER_LIST, USER_ADD, USER_GETONE, USER_UPDATE, USER_CLEARPWD, USER_DELETE, AI_LIST,
    CompanyGetlist, CompanyGetlistAll, CompanyAdduser, CompanyGetone, CompanyUpdate,
    CompanyDel, CameraGetlist, CameraAdd, CameraGetone, CameraUpdate, CameraDel,
    AlarmGetlist, HOME_INFO, HOME_INFO_TIME, HOME_INFO_RANK, AlarmGetone,MAPSCHOOL
}