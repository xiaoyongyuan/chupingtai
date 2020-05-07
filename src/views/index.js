// 数据看板
import Overview from "./overview/overview"
//AI预警
import Warning from "./warning/warning";
//审核处理
import AuditProcessing from "./processing/AuditProcessing";
//企业设备
import EnterpriseEquipment from "./equipment/EnterpriseEquipment";
//巡检设置
import PatrolSettings from "./patroSettings/PatrolSettings";
//用户管理
import UserSettings from "./userSettings/UserSettings";
//服务绑定
import ServiceBinding from "./service/ServiceBinding";
//系统管理-系统设置
import Setting from "./system/setting";



export default {
    Warning, Setting,Overview,AuditProcessing,EnterpriseEquipment,PatrolSettings,UserSettings,ServiceBinding
};
