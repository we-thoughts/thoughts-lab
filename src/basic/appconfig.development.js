const POSTER_TAGS = ["交易", "租借", "咨询", "失物", "拼团", "社群", "招聘", "其它"];
const DEVELOPMENT_CONFIG = {
  version: "20191026001",
  env: "development",
  services: {
    "ifanr-server": {
      developer_id: {
        client_id: "9597b4351559045ce5b5"
      },
      common: {
        credit: {
          TABLE_NAMES: {
            credit: 'CreditTable'
          }
        }
      },
      poster: {
        poster: {
          TABLE_NAMES: {
            poster: 'PosterTable'
          },
          REQUSET_PARAMS: {
            posters_limit: 10,
            posters_offset: 0,
            older_posters_limit: 10,
            default_order_by: ['-created_at'] // 降序
          }
        }
      },
      system: {
        changelog: {
          TABLE_NAMES: {
            changelog: 'ChangelogTable'
          },
          REQUSET_PARAMS: {
            posters_limit: 1000,
            posters_offset: 0,
            default_order_by: ['-created_at']
          }
        }
      }
    }
  },
  modules: {
    common: {
      credit: {
        max_poster_credit: 3
      },
      user: {}
    },
    poster: {
      poster: {
        POSTER_TAGS: POSTER_TAGS,
        REQUSET_PARAMS: {
          posters_limit: 10,
          posters_offset: 0,
          older_posters_limit: 10,
          default_order_by: ['-created_at']
        }
      },
      publish: {
        PUBLISH_TAGS: POSTER_TAGS,
        PUBLISH_OPT: {
          picture_category_name: "poster_picture"
        }
      }
    },
    system: {}
  },
  pages: {
    poster: {
      myposter: {
        pagetitle: "我的发布",
        capsule_vice_icon: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iO1YFIMFSA4N9zf.png"
      },
      poster: {
        pagetitle: "列表",
        capsule_main_icon: "https://cloud-minapp-29437.cloud.ifanrusercontent.com/1iL8N7ythebKRzx6.png"
      },
      publish: {
        pagetitle: "发布"
      }
    },
    system: {
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
  }
};

export default DEVELOPMENT_CONFIG;

export { DEVELOPMENT_CONFIG }
