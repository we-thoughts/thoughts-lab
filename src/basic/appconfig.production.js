const POSTER_TAGS = ["交易", "租借", "咨询", "失物", "拼团", "社群", "招聘", "其它"];
const PRODUCTION_CFG = {
  version: "20191218001",
  env: "production",
  apps: {
    system: {
      data: {
        credit: {
          TABLE_NAMES: "CreditTable"
        }
      },
      repos: {},
      pages: {}
    },
    public: {
      data: {
        changelog: {
          TABLE_NAMES: "ChangelogTable",
          REQUSET_PARAMS: {
            posters_limit: 1000,
            posters_offset: 0,
            default_order_by: ['-created_at']
          }
        }
      },
      repos: {},
      pages: {
        changelog: {
          pagetitle: "开发日志"
        },
        profile: {
          pagetitle: "个人",
          ICON_PATHS: {
            email: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iDqa5hgHwxpBUNC.png",
            poster_credit: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iDqa5H40mWkNPHe.png",
            changelog: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iG0ZvmDGE8PDISR.png",
            todo: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iG0p8gQ5ivroFQ5.png",
            chat_service: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iJePBdzg5y4OH1p.png"
          },
          TUCAO: {
            app_id: "wx8abaf00ee8c3202e",
            product_id: 102267
          }
        },
        verify: {
          pagetitle: "邮箱验证",
          EMAIL_VERIFY: {
            email_input_placeholder: "请输入 CUC 邮箱",
            email_suffix: "cuc.edu.cn",
            email_suffix_invalid_toast_title: "必须是中国传媒大学的邮箱噢！"
          }
        }
      }
    },
    poster: {
      data: {
        poster: {
          TABLE_NAMES: "PosterTable",
          PUBLISH_OPT: {
            picture_category_name: "poster_picture"
          },
          REQUSET_PARAMS: {
            posters_limit: 10,
            posters_offset: 0,
            older_posters_limit: 10,
            default_order_by: ['-created_at'] // 降序
          }
        }
      },
      repos: {
        POSTER_TAGS: POSTER_TAGS,
        INITIAL_POSTER_TAGS: POSTER_TAGS,
        PUBLISH_TAGS: POSTER_TAGS,
        PUBLISH_PERMISSIONS: {
          num_of_publish: 10,
          num_of_pics: 9
        }
      },
      pages: {
        poster: {
          pagetitle: "列表",
          capsule_main_icon: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iL8N7ythebKRzx6.png"
        },
        myposter: {
          pagetitle: "我的发布",
          capsule_vice_icon: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iO1YFIMFSA4N9zf.png"
        },
        publish: {
          pagetitle: "发布"
        }
      }
    }
  },
  tag: "prepare",
  expire: 43200
};
// console.info(JSON.stringify(PRODUCTION_CFG))

export default PRODUCTION_CFG;

export { PRODUCTION_CFG }
