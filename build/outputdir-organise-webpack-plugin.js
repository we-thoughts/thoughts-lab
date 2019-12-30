const fse = require("fs-extra");

const plugin_name = "OutputdirOrganiseWebpackPlugin";
const PATH_MAP = {
  "common": "miniprogram/common",
  "components": "miniprogram/components",
  "wxcomponents/custom-tab-bar": "miniprogram/custom-tab-bar",
  "pages": "miniprogram/pages",
  "wxcomponents": "miniprogram/wxcomponents",
  "app.js": "miniprogram/app.js",
  "app.json": "miniprogram/app.json",
  "app.wxss": "miniprogram/app.wxss",
};

class OutputdirOrganiseWebpackPlugin {

  constructor(options) {
    let { dist_dir, env } = options;
    this.dist_dir = dist_dir;
    this.env = env;
  }

  async organizeFiles() {
    let dist_dir = this.dist_dir;
    await fse.ensureDir(`${dist_dir}/miniprogram`);
    for (let key of Object.keys(PATH_MAP)) {
      if (this.env === "build") {
        await fse.move(`${dist_dir}/${key}`, `${dist_dir}/${PATH_MAP[key]}`, { overwrite: true });
      }
      if (this.env === "dev") {
        await fse.copy(`${dist_dir}/${key}`, `${dist_dir}/${PATH_MAP[key]}`, { overwrite: true });
      }
    }
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      plugin_name,
      (compilation, callback) => {
        this.organizeFiles().then(() => {
          callback();
        }).catch((err) => { })
      }
    );
  }
}

module.exports = OutputdirOrganiseWebpackPlugin;
