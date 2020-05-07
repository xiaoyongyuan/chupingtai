
export default {
    menuList: [
        {
            title: "数据看板",
            key: "/overview",
            component: "Overview",
            icon: "FundOutlined",
            rank:['0','1']
        },
        {
            title: "AI预警",
            key: "/main/Warning",
            component: "Warning",
            icon: "AlertOutlined",
            rank:['0','1']
        },
        {
            title: "审核处理",
            key: "/main/auditProcessing",
            component: "AuditProcessing",
            icon: "AuditOutlined",
            rank:['0','1']
        },
        {
            title: "企业设备",
            key: "/main/enterpriseEquipment",
            component: "EnterpriseEquipment",
            icon: "GroupOutlined",
            rank:['0','1']
        },
        {
            title: "巡检设置",
            key: "/main/patrolSettings",
            component: "PatrolSettings",
            icon: "ContainerOutlined",
            rank:['0','1']
        },
        {
            title: "用户管理",
            key: "/main/userSettings",
            component: "UserSettings",
            icon: "IdcardOutlined",
            rank:['0']
        },
        // {
        //     title: "服务绑定",
        //     key: "/main/serviceBinding",
        //     component: "ServiceBinding",
        //     icon: "BlockOutlined"
        // },
        // {
        //     title: "系统管理",
        //     key: "/main/setting",
        //     component: "Setting",
        //     icon: "AppstoreOutlined",
        //   /*  children: [
        //         {
        //             title: "系统设置",
        //             key: "/main/setting/System",
        //             component: "Setting",
        //         },
        //     ]*/
        // },
    ],
};
