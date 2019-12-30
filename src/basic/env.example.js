
let env = process.env.NODE_ENV;

let env_config = {
  // 开发环境配置
  development: {
    server: {
      "ifanr-server": {
        developer_id: {
          client_id: "your Ifanr(知晓云) server client_id"
        },
        options: {
          env: "知晓云环境 ID"
        }
      },
      "wx-server": {
        env: "your cloud development(微信小程序云开发) environment id",
        traceUser: true
      }
    }
  },
  // 生产环境配置
  production: {
    server: {
      "ifanr-server": {
        developer_id: {
          client_id: "your Ifanr(知晓云) server client_id"
        },
        options: {
          env: "知晓云环境 ID" // 可选，默认为生产环境
        }
      },
      "wx-server": {
        env: "your cloud development(微信小程序云开发) environment id",
        traceUser: true
      }
    }
  }
}

console.info(`------------ env_config: enviornment = ${env} ------------`)

export default env_config[env]
