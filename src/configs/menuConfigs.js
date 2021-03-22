const menuList =  [
    {
        "title":"地址管理",
        "path":"/tv/all",
        "children":[
            {
                "title":"查询原地址",
                "path":"/tv/all/queryAdd"
            },
            {
                "title":"查询代收点",
                "path":"/tv/all/queryCollectPoint"
            },
            {
                "title":"推荐轨迹",
                "path":"/tv/all/recommendedTrajectory"
            }
        ]
    },
    {
        "title":"业务员管理（百度）",
        "path":"/tv/bmap",
        "children":[
            {
                "title":"签收点地图管理",
                "path":"/tv/bmap/mapManger"
            },
            /* {
                "title":"推荐代收点管理",
                "path":"/tv/bmap/collectPointManager"
            }, */
        ]
    },
    {   
    "title":"业务员管理（高德）",
    "path":"/tv/amap",
    "children":[
        {
            "title":"签收点地图管理",
            "path":"/tv/amap/mapManger"
        },
       /*  {
            "title":"签收点数据管理",
            "path":"/amap/dataManger"
        },
        {
            "title":"地址围栏管理",
            "path":"/amap/fenceManger"
        },
        {
            "title":"推荐代收点管理",
            "path":"/amap/collectPointManager"
        },
        {
            "title":"多频次轨迹推荐",
            "path":"/amap/trail"
        }, */

        ]
    },
    {   
        "title":"业务员监控",
        "path":"/tv/amapJK",
        "children":[
            {
                "title":"轨迹回放",
                "path":"/tv/amapJK/Trackplayback"
            },
           /*  {
                "title":"签收点数据管理",
                "path":"/amap/dataManger"
            },
            {
                "title":"地址围栏管理",
                "path":"/amap/fenceManger"
            },
            {
                "title":"推荐代收点管理",
                "path":"/amap/collectPointManager"
            },
            {
                "title":"多频次轨迹推荐",
                "path":"/amap/trail"
            }, */
    
            ]
        },
   
   /*  {
        "title":"业务员管理（腾讯）",
        "path":"/tmap",
        "children":[
            {
                "title":"签收点地图管理",
                "path":"/tmap/mapManger"
            }
        ]
    }, */{
        "title":"纠偏结果",
        "path":"/tv/correctResult",
        "children":[
            {
                "title":"纠偏结果查询",
                "path":"/tv/correctResult/query"
            },
            {
                "title":"纠偏日志表",
                "path":"/tv/correctResult/log"
            }
        ]
    },{
        "title":"其它管理",
        "path":"/tv/elseManager",
        "children":[
            {
                "title":"信息统计",
                "path":"/tv/elseManager/statistics"
            }
        ]
    },
]
export default menuList