/* Official public list-price audit for every model in snapshot.js. */
(function () {
  'use strict';

  const sources = {
    volcModelPricing: { title: '火山方舟模型定价', url: 'https://docs.volcengine.com/docs/ark/model-pricing?lang=zh' },
    volcSeedanceActivity: { title: 'Seedance 2.0 Fast 后付费活动', url: 'https://www.volcengine.com/activity/seedance2' },
    volcSeedanceResourcePack: { title: 'Seedance 2.0 资源包规则', url: 'https://docs.volcengine.com/docs/ark/seedance-2-0-model-resource-pack-rules?lang=zh' },
    volcLegacyDeprecation: { title: '火山模型计费与停服说明', url: 'https://docs.volcengine.com/docs/aidap/Billing_items_and_prices_of_large_model_access?lang=en' },
    volcModelDeprecation: { title: '火山方舟模型生命周期公告', url: 'https://docs.volcengine.com/docs/ark/model-deprecation-notice?lang=zh' },
    volcMediaKitImage: { title: '火山智能处理图片工具计费', url: 'https://docs.volcengine.com/docs/Intelligentprocessing/image-tool-billing?lang=zh' },
    volcMediaKitVideo: { title: '火山智能处理视频工具计费', url: 'https://docs.volcengine.com/docs/Intelligentprocessing/video-tool-billing?lang=zh' },
    volcMediaKitAudio: { title: '火山智能处理音频工具计费', url: 'https://docs.volcengine.com/docs/Intelligentprocessing/audio-tool-billing?lang=zh' },
    volcSeedAudioDocs: { title: '火山短剧创作产品文档', url: 'https://docs.volcengine.com/docs/drama-creation/short-play-creation?lang=zh' },
    baiduTtsPricing: { title: '百度语音合成计费说明', url: 'https://ai.baidu.com/ai-doc/SPEECH/Ql9misjot' },
    baiduTtsApi: { title: '百度短文本在线合成 API', url: 'https://ai.baidu.com/ai-doc/SPEECH/mlbxh7xie' },
    baiduErnie: { title: '百度千帆 ERNIE 4.5 Turbo 32K', url: 'https://cloud.baidu.com/doc/qianfan-api/s/Dmba8k71y' },
    byteplusPricing: { title: 'BytePlus ModelArk pricing', url: 'https://docs.byteplus.com/en/docs/modelark/model-pricing?redirect=1' },
    byteplusHistoricPricing: { title: 'BytePlus ModelArk 历史定价页（用于解释旧配置）', url: 'https://docs.byteplus.com/docs/ModelArk/1099320' },
    byteplusDeprecation: { title: 'BytePlus ModelArk deprecation notice', url: 'https://docs.byteplus.com/en/docs/modelark/model-deprecation-notice' },
    byteplusSeedAudioPricing: { title: 'BytePlus Audio 1.0 pricing', url: 'https://docs.byteplus.com/en/docs/byteplusvoice/audiopricing' },
    byteplusSeedAudioDocs: { title: 'BytePlus Seed Audio 1.0 API', url: 'https://docs.byteplus.com/en/docs/byteplusvoice/seedaudio-01' },
    byteplusTtsPricing: { title: 'BytePlus Text-to-Speech pricing', url: 'https://docs.byteplus.com/en/docs/byteplusvoice/TTS_Billing' },
    byteplusTtsDocs: { title: 'BytePlus Seed Speech TTS 2.0', url: 'https://docs.byteplus.com/en/docs/byteplusvoice/texttospeechv2' },
    byteplusMediaKitPricing: { title: 'BytePlus AI MediaKit pricing', url: 'https://docs.byteplus.com/en/docs/byteplus-vod/ai-mediakit-pricing' },
    byteplusVodPricing: { title: 'BytePlus VOD pay-as-you-go pricing', url: 'https://docs.byteplus.com/api/docs/byteplus-vod/docs-pay-as-you-go-pricing' },
    byteplusMediaKitDocs: { title: 'BytePlus AI MediaKit documentation', url: 'https://docs.byteplus.com/en/docs/byteplus-vod/ai-mediakit-voice-and-background-audio-separation' },
    klingGuide: { title: 'Kling 3.0 user guide and consumer credits', url: 'https://app.klingai.com/cn/quickstart/klingai-video-3-model-user-guide' },
    klingApiVideoPricing: { title: 'Kling AI API video pricing', url: 'https://kling.ai/document-api/pricing/base/video' },
    googleVertexPricing: { title: 'Google Cloud generative AI pricing', url: 'https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing' },
    googleGemini25FlashImageModel: { title: 'Vertex AI Gemini 2.5 Flash Image model card', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/2-5-flash-image' },
    googleModelLifecycle: { title: 'Vertex AI model versions and lifecycle', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions' },
    googleVeo31Model: { title: 'Vertex AI Veo 3.1 model card and quota modes', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate' },
    googleTtsPricing: { title: 'Google Cloud Text-to-Speech pricing', url: 'https://cloud.google.com/text-to-speech/pricing' },
    geminiPricing: { title: 'Gemini API pricing', url: 'https://ai.google.dev/gemini-api/docs/pricing?authuser=1' },
    geminiDeprecations: { title: 'Gemini API deprecations', url: 'https://ai.google.dev/gemini-api/docs/deprecations' },
    minimaxPricing: { title: 'MiniMax API enterprise pricing', url: 'https://platform.minimax.io/subscribe/token-plan?tab=api-enterprise' },
    minimaxPaygoPricing: { title: 'MiniMax pay-as-you-go pricing', url: 'https://platform.minimax.io/docs/guides/pricing-paygo' },
    minimaxHailuo23Release: { title: 'MiniMax Hailuo 2.3 release and pricing note', url: 'https://www.minimax.io/news/minimax-hailuo-23' },
    bflFlux2Pricing: { title: 'Black Forest Labs FLUX.2 pricing', url: 'https://bfl.ai/pricing?category=flux.2' },
    bflFlux3Pricing: { title: 'Black Forest Labs model cost guide', url: 'https://help.bfl.ai/articles/7986977817-what-are-the-costs-associated-with-using-your-models' },
    xaiImagePricing: { title: 'xAI Grok Imagine Image 2.0 pricing', url: 'https://docs.x.ai/developers/models/grok-imagine-image-2.0' },
    xaiVideoPricing: { title: 'xAI Grok Imagine Video 1.5 pricing', url: 'https://docs.x.ai/developers/models/grok-imagine-video-1.5-preview' },
    alibabaPricing: { title: 'Alibaba Cloud Model Studio pricing', url: 'https://www.alibabacloud.com/help/en/model-studio/model-pricing' },
    alibabaHappyHorse11: { title: 'HappyHorse 1.1 reference-to-video', url: 'https://www.alibabacloud.com/help/en/model-studio/happyhorse-1-1-r2v' },
    alibabaHappyHorse10: { title: 'HappyHorse 1.0 reference-to-video', url: 'https://www.alibabacloud.com/help/en/model-studio/happyhorse-1-0-r2v' },
  };

  const models = {
    '21:doubao-seedream-5-0-pro-260628': {
      status: 'verified',
      headline: '普通输出 ¥0.30/张（≤2.61MP），¥0.60/张（>2.61MP）',
      detail: '首张输入图免费，第 2 张起 ¥0.02/张；拆图层输出 ≤2.61MP 为 ¥0.15/图层，>2.61MP 为 ¥0.30/图层。',
      note: '当前普通文生图、图生图和重绘应按普通单图输出价核算；人民币原厂刊例。',
      source: 'volcModelPricing',
    },
    '21:doubao-seedream-5-0-260128': {
      status: 'verified', headline: '¥0.22/输出图', detail: '输入图免费，输出按成功图片张数计费。', note: '人民币原厂刊例。', source: 'volcModelPricing',
    },
    '21:doubao-seedream-4-5-251128': {
      status: 'verified', headline: '¥0.25/输出图', detail: '输入免费，输出按成功图片张数计费。', note: '人民币原厂刊例。', source: 'volcModelPricing',
    },
    '21:doubao-seedream-4-0-250828': {
      status: 'verified', headline: '¥0.20/输出图', detail: '输入免费，输出按成功图片张数计费。', note: '人民币原厂刊例。', source: 'volcModelPricing',
    },
    '21:doubao-seedance-2-0-260128': {
      status: 'verified',
      headline: '¥46/M 视频 tokens（480P/720P，无视频输入）',
      detail: '480P/720P：无/有视频输入 ¥46/¥28 每百万视频 tokens；1080P 为 ¥51/¥31；4K 为 ¥26/¥16。官方 5 秒 16:9 无视频输入示例：480P ¥2.31、720P ¥4.97、1080P ¥12.39、4K ¥25.27。',
      note: '原厂按实际视频 tokens 计费，不等同于后台固定秒价。', source: 'volcModelPricing',
    },
    '21:doubao-seedance-2-0-fast-260128': {
      status: 'verified',
      headline: '刊例 ¥37/M（无视频输入）；活动价 ¥27.75/M 视频 tokens',
      detail: '仅 480P/720P。刊例无/有视频输入为 ¥37/¥22 每百万视频 tokens；2026-08-07 14:00 至 2026-10-07 14:00 后付费 75 折，为 ¥27.75/¥16.50。',
      note: '活动价仅后付费，资源包不参加；选择时应同时展示刊例和限时价。', source: 'volcModelPricing', extraSources: ['volcSeedanceActivity', 'volcSeedanceResourcePack'],
    },
    '21:doubao-seed-2-1-pro-260628': {
      status: 'verified', headline: '输入/缓存命中/输出：¥6 / ¥1.2 / ¥30 每 M tokens', detail: '常规在线推理，0~1024K；缓存存储 ¥0.017/M tokens/小时。', note: '非音频输入，人民币原厂刊例。', source: 'volcModelPricing',
    },
    '21:doubao-seed-2-1-turbo-260628': {
      status: 'verified', headline: '输入/缓存命中/输出：¥3 / ¥0.6 / ¥15 每 M tokens', detail: '常规在线推理，0~256K；缓存存储 ¥0.017/M tokens/小时。', note: '人民币原厂刊例。', source: 'volcModelPricing',
    },
    '21:doubao-seed-2-0-pro-260215': {
      status: 'review',
      headline: '已停止新购，计划 2026-11-24 停服',
      detail: '历史常规价：0~32K 输入/缓存命中/输出 ¥3.2/¥0.64/¥16；32~128K ¥4.8/¥0.96/¥24；128~256K ¥9.6/¥1.92/¥48，每 M tokens；缓存存储 ¥0.017/M tokens/小时。',
      note: '价格已核，需复核的是生命周期：2026-09-24 10:00 EOM（停止新购/新增接入点），2026-11-24 14:00 EOS；官方建议迁移到 doubao-seed-2-1-pro-260915。本地快照已禁用。',
      localBasis: '本地成本输入 ¥9.60/M、输出 ¥48/M，正好取历史 128K~256K 最高阶梯的文本输入与输出价；售价 ¥19.20/¥96 均为成本×2。',
      nextStep: '保持禁用并从候选清单剔除，不再尝试按历史价恢复。',
      source: 'volcModelPricing', extraSources: ['volcModelDeprecation'],
    },
    '21:doubao-seed-2-0-mini-260428': {
      status: 'verified',
      headline: '0~32K：文本输入/缓存命中/输出 ¥0.2 / ¥0.04 / ¥2 每 M tokens',
      detail: '0~32K 文本输入/音频输入/文本缓存/音频缓存/输出为 ¥0.2/¥3/¥0.04/¥0.6/¥2；32~128K 为 ¥0.4/¥6/¥0.08/¥1.2/¥4；128~256K 为 ¥0.8/¥12/¥0.16/¥2.4/¥8。缓存存储均 ¥0.017/M tokens/小时。',
      note: '本地快照显示禁用；人民币常规在线刊例。', source: 'volcModelPricing',
    },
    '21:doubao-seed-2-0-lite-260428': {
      status: 'verified',
      headline: '0~32K：文本输入/缓存命中/输出 ¥0.6 / ¥0.12 / ¥3.6 每 M tokens',
      detail: '0~32K 文本输入/音频输入/文本缓存/音频缓存/输出为 ¥0.6/¥9/¥0.12/¥1.8/¥3.6；32~128K 为 ¥0.9/¥13.5/¥0.18/¥2.7/¥5.4；128~256K 为 ¥1.8/¥27/¥0.36/¥5.4/¥10.8。缓存存储均 ¥0.017/M tokens/小时。',
      note: '人民币常规在线刊例。', source: 'volcModelPricing',
    },
    '23:volc-mediakit': {
      status: 'verified',
      headline: '12 项工具官方价均已核；扩图 ¥0.03726/次',
      detail: '图片：扩图 ¥0.03726/次，Professional 图片高清 ¥0.036/次，标准擦除/背景移除 ¥0.00138/次。视频/音频：人声分离 ¥0.07/输入分钟，剧本还原 ¥3/输入分钟，精细字幕擦除和故事线分析各 ¥1/分钟；四档视频高清的本地保护价为 ¥24/¥240/¥6.40/¥40 每输出分钟。',
      note: '官方价已核；四档视频增强的本地固定价取支持范围内最高规格，不等于多数任务的实际厂商账单。厂商按毫秒累计，本地则至少 1 分钟并向上取整。',
      localBasis: '图片：扩图/Professional 高清的 ¥0.03726/¥0.036 因普通表单只留两位元小数，均录 ¥0.04；擦除/抠图录 ¥0.01 是整分保护值。视频：人声分离、剧本还原、字幕擦除、故事线分析分别按官方 ¥0.07/¥3/¥1/¥1 录入；标准/专业/极速高清取 4K、>60≤120fps 最高系数后为 ¥24/¥240/¥6.40，大模型因本地把4K降到2K，取2K最高系数为 ¥40。所有售价均为成本×2。',
      nextStep: '作为候选可继续评估；若希望成本台账贴近实际账单，应按分辨率/帧率拆档并改为毫秒级时长，而不是继续用最高规格整分钟保护价。',
      source: 'volcMediaKitImage', extraSources: ['volcMediaKitVideo', 'volcMediaKitAudio'],
    },

    '24:byteplus-seedance-1-0-pro-fast-251015': {
      status: 'verified', headline: '$1.00/M completion tokens', detail: '在线生成按实际 completion tokens 计费；没有一个对所有分辨率、时长恒定的秒价。', note: '美元 BytePlus 原厂刊例。', source: 'byteplusPricing',
    },
    '24:byteplus-seedance-1-5-pro-251215': {
      status: 'verified', headline: '含音频 $2.40/M；静音 $1.20/M completion tokens', detail: '官方典型 5 秒示例（含音频/静音）：480P $0.12/$0.06，720P $0.26/$0.13，1080P $0.58/$0.29；离线推理费率为在线一半。', note: '计划 2026-11-11 17:00 UTC+8 下线；固定秒价只是换算估算。', source: 'byteplusPricing', extraSources: ['byteplusDeprecation'],
    },
    '24:byteplus-dreamina-seedance-2-0-mini-260615': {
      status: 'verified', headline: '无/有视频输入 $3.50 / $2.10 每 M 视频 tokens', detail: '支持 480P/720P，不支持 1080P；输入视频与输出视频 tokens 共同影响总价。', note: '美元 BytePlus 原厂刊例。', source: 'byteplusPricing',
    },
    '24:byteplus-glm-5-3-flash-260828': {
      status: 'verified', headline: '输入/缓存命中/输出 $0.15 / $0.03 / $0.50 每 M tokens', detail: '显式缓存存储另 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-deepseek-v4-pro-ga-260813': {
      status: 'verified', headline: '输入/缓存命中/输出 $1.32 / $0.044 / $3.96 每 M tokens', detail: '显式缓存存储另 $0.0083/M token/小时。', note: '当前 BytePlus 官方主定价页已给出明确标准在线价。',
      localBasis: '数值可反推为按约 7.14 汇率折算：$1.32×7.14=¥9.4248，录入 ¥9.43/M 输入；$3.96×7.14=¥28.2744，录入 ¥28.28/M 输出；售价均为成本×2。数据库未保存当时采用的汇率，此处是数值反推。',
      source: 'byteplusPricing',
    },
    '24:byteplus-deepseek-v4-flash-ga-260731': {
      status: 'verified', headline: '输入/缓存命中/输出 $0.44 / $0.014 / $1.32 每 M tokens', detail: '显式缓存存储另 $0.0083/M token/小时。', note: '当前 BytePlus 官方主定价页已给出明确标准在线价。',
      localBasis: '数值可反推为按约 7.14 汇率折算：$0.44×7.14=¥3.1416，录入 ¥3.15/M 输入；$1.32×7.14=¥9.4248，录入 ¥9.43/M 输出；售价均为成本×2。汇率为数值反推。',
      source: 'byteplusPricing',
    },
    '24:byteplus-dola-seed-2-1-turbo-260628': {
      status: 'verified', headline: '输入/缓存命中/输出 $0.50 / $0.10 / $2.50 每 M tokens', detail: '显式缓存存储另 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-glm-5-2-260617': {
      status: 'verified', headline: '输入/缓存命中/输出 $1.40 / $0.26 / $4.40 每 M tokens', detail: '显式缓存存储另 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-seed-2-0-mini-260428': {
      status: 'verified', headline: '≤128K：文本输入/缓存命中/输出 $0.10 / $0.02 / $0.40 每 M tokens', detail: '≤128K 音频输入/缓存 $1.50/$0.30；>128K~256K 文本输入/文本缓存/输出 $0.20/$0.04/$0.80，音频输入/缓存 $3.00/$0.60；存储 $0.0083/M token/小时。', note: '当前仓库只开放 text2text/image2text，本地价格保守取非音频最高阶梯。',
      localBasis: '本地输入/输出 ¥1.43/¥5.72，可反推为取 >128K~256K 的 $0.20/$0.80 档并乘约 7.14：得到 ¥1.428/¥5.712 后保留到分；售价均为成本×2。',
      source: 'byteplusPricing',
    },
    '24:byteplus-seed-2-0-lite-260428': {
      status: 'verified', headline: '≤128K：文本输入/缓存命中/输出 $0.25 / $0.05 / $2.00 每 M tokens', detail: '≤128K 音频输入/缓存 $3.75/$0.75；>128K 文本输入/音频输入/文本缓存/音频缓存/输出 $0.50/$7.50/$0.10/$1.50/$4.00。存储 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-deepseek-v4-flash-260425': {
      status: 'verified', headline: '当前输入/缓存命中/输出 $0.44 / $0.014 / $1.32 每 M tokens', detail: '历史页曾为 $0.14/$0.028/$0.28；显式缓存存储另 $0.0083/M token/小时。', note: '当前官方价与模型在售状态已核；本地原先精确吻合旧刊例，已于 2026-09-30 通过 Admin 更正。',
      localBasis: '按约 7.14 折算：$0.44×7.14=¥3.1416，录入输入成本 ¥3.15/M；$1.32×7.14=¥9.4248，录入输出成本 ¥9.43/M；售价分别为 ¥6.30/¥18.86（成本×2）。汇率为数值反推。',
      source: 'byteplusPricing', extraSources: ['byteplusHistoricPricing'],
    },
    '24:byteplus-deepseek-v4-pro-260425': {
      status: 'verified', headline: '当前输入/缓存命中/输出 $1.32 / $0.044 / $3.96 每 M tokens', detail: '历史页曾为 $1.74/$0.145/$3.48；显式缓存存储另 $0.0083/M token/小时。', note: '当前官方价与模型在售状态已核；本地原先精确吻合旧刊例，已于 2026-09-30 通过 Admin 更正。',
      localBasis: '按约 7.14 折算：$1.32×7.14=¥9.4248，录入输入成本 ¥9.43/M；$3.96×7.14=¥28.2744，录入输出成本 ¥28.28/M；售价分别为 ¥18.86/¥56.56（成本×2）。汇率为数值反推。',
      source: 'byteplusPricing', extraSources: ['byteplusHistoricPricing'],
    },
    '24:byteplus-seed-2-0-code-preview-260328': {
      status: 'verified', headline: '≤128K 输入/缓存命中/输出 $0.50 / $0.10 / $3.00 每 M tokens', detail: '>128K 为 $1.00/$0.20/$6.00；缓存存储另 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-seed-2-0-pro-260328': {
      status: 'verified', headline: '≤128K 输入/缓存命中/输出 $0.50 / $0.10 / $3.00 每 M tokens', detail: '>128K~256K 为 $1.00/$0.20/$6.00；显式缓存存储另 $0.0083/M token/小时。', note: '精确公开价已经取得，不是待询价。',
      localBasis: '本地输入/输出 ¥7.14/¥42.84，正好是最高阶梯 $1/$6×7.14；售价 ¥14.28/¥85.68 均为成本×2。汇率为数值反推。',
      source: 'byteplusPricing',
    },
    '24:byteplus-glm-4-7-251222': {
      status: 'verified', headline: '输入/缓存命中/输出 $0.60 / $0.11 / $2.20 每 M tokens', detail: '显式缓存存储另 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-seed-1-8-251228': {
      status: 'verified', headline: '≤128K 输入/缓存命中/输出 $0.25 / $0.05 / $2.00 每 M tokens', detail: '>128K 为 $0.50/$0.05/$4.00；缓存存储另 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-deepseek-v3-2-251201': {
      status: 'verified', headline: '≤32K 输入/缓存命中/输出 $0.28 / $0.056 / $0.42 每 M tokens', detail: '32K~128K 为 $0.56/$0.056/$0.84；缓存存储另 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-seed-1-6-250915': {
      status: 'verified', headline: '≤128K 输入/缓存命中/输出 $0.25 / $0.05 / $2.00 每 M tokens', detail: '>128K 为 $0.50/$0.05/$4.00；缓存存储另 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-seed-1-6-flash-250715': {
      status: 'verified', headline: '≤128K 输入/缓存命中/输出 $0.075 / $0.015 / $0.30 每 M tokens', detail: '>128K 为 $0.10/$0.015/$0.80；缓存存储另 $0.0083/M token/小时。', note: '标准在线推理。', source: 'byteplusPricing',
    },
    '24:byteplus-dreamina-seedance-2-5-260628': {
      status: 'verified', headline: '480P/720P 无/有视频输入 $10.70/$6.40 每 M 视频 tokens', detail: '1080P 无/有视频输入 $11.70/$7.00/M；官方 16:9、5 秒无视频示例为 480P $0.514、720P $1.156、1080P $2.843 每条。', note: '官方价格、SKU 与本地典型场景折算已核；但原厂按实际 completion tokens 和最低 token 消耗结算，本地固定秒价只代表典型场景，宽高比和输入时长变化会产生偏差。',
      localBasis: '无视频输入档按官方 16:9、5 秒示例÷5×7.2后保守留到分：¥0.75/¥1.67/¥4.10 每输出秒。带视频档 ¥0.57/¥1.28/¥3.15，精确吻合官方“输入2秒+输出5秒”的最低示例按7秒摊销再×7.2；售价均×2。汇率和取样场景为数值反推。',
      nextStep: '选型可继续，但上线前应用典型与极端输入时长、宽高比跑官方计算器并与真实 token 账单对账；不要把固定秒价当作所有请求的原厂精确成本。',
      source: 'byteplusPricing',
    },
    '24:byteplus-dreamina-seedance-2-0-260128': {
      status: 'verified', headline: '480P/720P 无/有视频输入 $7.00 / $4.30 每 M 视频 tokens', detail: '1080P 为 $7.70/$4.70；4K 为 $4.00/$2.40。输入视频与输出视频 tokens 共同影响总价。', note: '美元 BytePlus 原厂刊例。', source: 'byteplusPricing',
    },
    '24:byteplus-dreamina-seedance-2-0-fast-260128': {
      status: 'verified', headline: '无/有视频输入 $5.60 / $3.30 每 M 视频 tokens', detail: '支持 480P/720P，不支持 1080P；输入视频与输出视频 tokens 共同影响总价。', note: '美元 BytePlus 原厂刊例。', source: 'byteplusPricing',
    },

    '25:kling-global-video-v3-omni': {
      status: 'verified', headline: '无视频输入 $0.112/$0.140/$0.420 每秒（720P/1080P/4K，含音频）', detail: '无视频且无音频为 $0.084/$0.112/$0.420；有视频输入且无原生音频为 $0.126/$0.168/$0.420 每秒。官方 API 页直接列美元价，不是消费者 credits。', note: '公开价已核；本地因无法单独拆音频开关，对无视频请求取含音频高档。合同/资源包有效成本可能更低。',
      localBasis: '按固定汇率 50/7≈7.142857 反推：无视频含音频 $0.112/$0.140/$0.420 → ¥0.80/¥1.00/¥3.00；有视频 $0.126/$0.168/$0.420 → ¥0.90/¥1.20/¥3.00。售价均×2；汇率来源未存库，是数值反推。',
      source: 'klingApiVideoPricing', extraSources: ['klingGuide'],
    },
    '25:kling-global-video-v3': {
      status: 'verified', headline: '含原生音频 $0.126/$0.168/$0.420 每秒（720P/1080P/4K）', detail: '不含原生音频为 $0.084/$0.112/$0.420 每秒；官方 API 页直接列美元现金价。普通 Kling 3.0 不支持视频输入。', note: '本地取含音频高档作保守成本；合同/资源包有效成本可能低于公开价。',
      localBasis: '按固定汇率 50/7≈7.142857 反推：$0.126/$0.168/$0.420 → ¥0.90/¥1.20/¥3.00；售价均×2。inCost=0 表示该模型不支持视频输入，不是参考图免费。汇率来源未存库。',
      source: 'klingApiVideoPricing', extraSources: ['klingGuide'],
    },

    '27:gemini-3-pro-image': {
      status: 'verified', headline: '图片输出 $120/M tokens；1K/2K 约 $0.134/张，4K 约 $0.24/张', detail: '≤200K 输入 $2/M、缓存 $0.20/M、文本输出 $12/M；>200K 为 $4/$0.40/$18。每张输入图 560 tokens。', note: 'Google Cloud Standard、全球区原厂刊例。', source: 'googleVertexPricing',
    },
    '27:gemini-3.1-flash-image': {
      status: 'verified', headline: '图片输出 $60/M tokens；512/1K/2K/4K 约 $0.045/$0.067/$0.101/$0.15 每张', detail: '输入 $0.50/M、缓存 $0.05/M、文本输出 $3/M；每张输入图 1120 tokens。', note: 'Google Cloud Standard 原厂刊例。', source: 'googleVertexPricing',
    },
    '27:gemini-3.1-flash-lite-image': {
      status: 'verified', headline: '图片输出 $30/M tokens；1K 约 $0.034/张', detail: '输入 $0.25/M、缓存 $0.025/M、文本输出 $1.50/M；每张输入图 1120 tokens。', note: 'Google Cloud Standard 原厂刊例。', source: 'googleVertexPricing',
    },
    '27:gemini-2.5-flash-image': {
      status: 'verified',
      headline: '图片输出 $30/M tokens；≤1024² 精确为 $0.0387/张',
      detail: '输入 $0.30/M、文本输出 $2.50/M；≤1024² 输出为 1290 tokens，所以 1290 × $30 / 1,000,000 = $0.0387。',
      note: '官方价格与 SKU 已核。本地通过 Vertex AI 调用，应以 Vertex 生命周期为准：已进入 Deprecated，计划 2027-03-15 退役，不是 Gemini API 的 2026-10-02。',
      localBasis: '1K 输出成本可反推为 $0.0387 × 约 7.15 = ¥0.276705，录入 ¥0.28/张；售价 ¥0.56 = 成本×2。base_request 和输入图各 ¥0.01 是本地保护值，不是 Google 官方固定费。',
      nextStep: '新选型优先迁移到 gemini-3.1-flash-lite-image；若保留，在 2027-03-15 前完成迁移和回归验收。',
      source: 'googleVertexPricing', extraSources: ['googleGemini25FlashImageModel', 'googleModelLifecycle'],
    },
    '27:gemini-omni-1.1-flash-preview': {
      status: 'verified', headline: '输入 $1.50/M；文本输出 $9/M；视频输出 $17.50/M tokens', detail: '输入折算：1120 tokens/图、32 tokens/音频秒、5792 tokens/视频秒；含音频视频输出为 360P 1931、720P 5792、1080P 8688、4K 17376 tokens/秒。', note: '后台固定秒价是由官方 token 费率换算的估值，不是原厂直接秒价。', source: 'googleVertexPricing',
    },
    '27:veo-3.1-generate-001': {
      status: 'verified', headline: '含音频 720P/1080P $0.40/秒；4K $0.60/秒', detail: '仅视频 720P/1080P $0.20/秒，4K $0.40/秒。', note: '官方价格、SKU 与本地含音频折算已核；但模型页注明 Pay-as-you-go 不支持，需 Fixed quota / Provisioned Throughput。本地只有“分辨率×秒”一档，关闭音频时仍按含音频价记成本。',
      localBasis: '按默认含音频价反推：$0.40/$0.60 × 约 7.15，向上留到分为 ¥2.86/¥4.29 每秒；售价均为成本×2。静音 720P/1080P 官方仅 $0.20/秒，现配置会高估 100%；4K 会高估 50%。',
      nextStep: '先在 Google Cloud Console 确认项目已购得 Fixed quota；再决定是禁用静音模式，还是增加含/不含音频的独立价格维度。',
      source: 'googleVertexPricing', extraSources: ['googleVeo31Model', 'googleModelLifecycle'],
    },
    '27:veo-3.1-fast-generate-001': {
      status: 'verified', headline: '含音频 720P/1080P/4K $0.10/$0.12/$0.30 每秒', detail: '仅视频 720P/1080P/4K $0.08/$0.10/$0.25 每秒。', note: '官方价格、SKU 与本地含音频折算已核；Pay-as-you-go 不支持，需 Fixed quota / Provisioned Throughput。GA 版本最早退役日为 2026-11-17；本地关闭音频时仍按含音频价记成本。',
      localBasis: '按含音频价反推：$0.10/$0.12 × 约 7.15，向上留到分为 ¥0.72/¥0.86 每秒；售价×2。静音时官方价为 $0.08/$0.10，现配置约高估 24.1%/19.4%。',
      nextStep: '确认 Fixed quota 和 2026-11-17 后可用的替代版本；若允许关闭音频，补独立计价维度。',
      source: 'googleVertexPricing', extraSources: ['googleVeo31Model', 'googleModelLifecycle'],
    },
    '27:veo-3.1-lite-generate-001': {
      status: 'verified', headline: '含音频 720P/1080P $0.05/$0.08 每秒', detail: '仅视频 720P/1080P $0.03/$0.05 每秒。', note: '官方价格、SKU 与本地含音频折算已核；仍是 Preview，Pay-as-you-go 不支持，需 Fixed quota / Provisioned Throughput。本地关闭音频时仍按含音频价记成本。',
      localBasis: '按含音频价反推：$0.05/$0.08 × 约 7.15，向上留到分为 ¥0.36/¥0.58 每秒；售价×2。静音时官方价为 $0.03/$0.05，现配置约高估 63.6%/61.1%。',
      nextStep: '预览模型不建议作唯一生产选项；先确认 Fixed quota，并决定是否补音频开关分价。',
      source: 'googleVertexPricing', extraSources: ['googleVeo31Model'],
    },
    '27:gemini-3.1-flash-tts-preview': {
      status: 'verified', headline: '文本输入 $1/M；音频输出 $20/M tokens', detail: '音频按 25 tokens/秒折算；预览模型。', note: '后台千字符价必须按真实 token 用量估算，不能直接等同原厂单位。', source: 'googleTtsPricing',
    },
    '27:gemini-2.5-flash-tts': {
      status: 'verified', headline: '文本输入 $0.50/M；音频输出 $10/M tokens', detail: '音频按 25 tokens/秒折算。', note: '后台千字符价必须按真实 token 用量估算。', source: 'googleTtsPricing',
    },
    '27:gemini-2.5-flash-lite-preview-tts': {
      status: 'verified', headline: '文本输入 $0.50/M；音频输出 $10/M tokens', detail: '音频按 25 tokens/秒折算；预览模型。', note: '后台千字符价必须按真实 token 用量估算。', source: 'googleTtsPricing',
    },
    '27:gemini-2.5-pro-tts': {
      status: 'verified', headline: '文本输入 $1/M；音频输出 $20/M tokens', detail: '音频按 25 tokens/秒折算。', note: '后台千字符价必须按真实 token 用量估算。', source: 'googleTtsPricing',
    },

    '28:seed-audio-1.0': {
      status: 'verified', headline: '官方产品页面与 SKU 已核；现金价需控制台确认', detail: '官方产品文档能确认 Seed Audio 1.0 能力，但可访问的一手公开资料未展示同口径按分钟现金价；通用豆包 TTS 字符价不能替代完整音频生成。', note: '按“官方页面、产品/SKU 已确认即为官方已核”的口径归类。本地 ¥0.30/输出分钟可能由旧 EvoLink 路由迁移时保留或由管理员后续录入；迁移只改价格键、未重算价格，数据库也没有来源字段。',
      localBasis: '本地成本 ¥0.30/输出分钟、售价 ¥0.60（成本×2）。仓库迁移明确“只改键、不改管理员配置的价格内容”，因此不能把 ¥0.30 宣称为火山官方价。',
      nextStep: '从火山控制台、合同或真实账单取得 Seed Audio 1.0 同 SKU 单价；在拿到证据前按“本地预算价”使用，不作真实原厂成本承诺。',
      sourceLabel: '官方产品资料',
      source: 'volcSeedAudioDocs',
    },
    '30:byteplus-seed-audio-1-0': {
      status: 'verified', headline: '$0.15/生成分钟（按秒精确计费）', detail: 'Pay-as-you-go；开通服务赠送 60 分钟试用。API 返回的 original_duration 是计费时长，单次最长 120 秒。', note: '首次资源包 40% 折扣是限时首购促销，未作为长期成本依据。',
      localBasis: '本地成本 ¥1.08/分钟 = $0.15×7.2；售价 ¥2.16/分钟 = 成本×2。汇率为数值反推。',
      source: 'byteplusSeedAudioPricing', extraSources: ['byteplusSeedAudioDocs'],
    },
    '30:byteplus-seed-speech-tts-2-0': {
      status: 'verified', headline: '$30/M 字符，即 $0.03/千字符', detail: 'Pay-as-you-go；开通服务赠送 20,000 字符。字符定义包括中英文字符、标点、空格、换行和 SSML。', note: '官方公开按量价已经取得。',
      localBasis: '本地成本 ¥0.22/千字符，可反推为 $0.03×7.2=¥0.216 后保守留到分；售价 ¥0.44=成本×2。',
      source: 'byteplusTtsPricing', extraSources: ['byteplusTtsDocs'],
    },
    '31:minimax-global-h3': {
      status: 'verified', headline: '768P $0.08/输出秒；2K $0.13/输出秒', detail: '前 5 张输入图免费，第 6 张起 $0.04/张；输入视频按选择的输出分辨率费率乘输入时长。', note: '国际站按量 API 价；768P→2K 再生成另 $0.05/输出秒。', source: 'minimaxPricing',
    },
    '31:minimax-global-hailuo-2-3': {
      status: 'verified', headline: '768P 6秒 $0.28；768P 10秒 $0.56；1080P 6秒 $0.49/条', detail: 'MiniMax 官方按量页已给出精确单条价，Hailuo 2.3 与 Hailuo 02 同价。', note: '当前官方页面把 Hailuo 2.3 放在 Legacy Models 区；Legacy 不等于已公告停服，但不宜作为唯一长期方案。订阅每日条数不能替代 API 按量成本。',
      localBasis: '按固定汇率 50/7≈7.142857 反推：$0.28/$0.56/$0.49 → ¥2/¥4/¥3.50；本地售价分别 ¥4/¥8/¥7，全部为成本×2。汇率来源未存库。',
      nextStep: '可按公开价比较，但选型时同时确认 Legacy 生命周期、账号实际资源包/合同价和替代模型。',
      source: 'minimaxPaygoPricing', extraSources: ['minimaxHailuo23Release'],
    },

    '32:bfl-flux-2-pro': {
      status: 'verified', headline: '首个输出 MP $0.03；额外输出 MP $0.015', detail: '每张参考图 $0.015/MP；分辨率按整 MP 向上取整。', note: '图片最多 4MP；参考图分别计费。', source: 'bflFlux2Pricing',
    },
    '32:bfl-flux-2-max': {
      status: 'verified', headline: '首个输出 MP $0.07；额外输出 MP $0.03', detail: '每张参考图 $0.03/MP；分辨率按整 MP 向上取整。', note: '图片最多 4MP；参考图分别计费。', source: 'bflFlux2Pricing',
    },
    '32:bfl-flux-2-flex': {
      status: 'verified', headline: '首个/额外输出 MP 均 $0.05', detail: '每张参考图 $0.05/MP；分辨率按整 MP 向上取整。', note: '图片最多 4MP；参考图分别计费。', source: 'bflFlux2Pricing',
    },
    '32:bfl-flux-2-klein-9b': {
      status: 'verified', headline: '首个输出 MP $0.015；额外输出 MP $0.002', detail: '每张参考图 $0.002/MP；分辨率按整 MP 向上取整。', note: '图片最多 4MP；参考图分别计费。', source: 'bflFlux2Pricing',
    },
    '32:bfl-flux-2-klein-4b': {
      status: 'verified', headline: '首个输出 MP $0.014；额外输出 MP $0.001', detail: '每张参考图 $0.001/MP；分辨率按整 MP 向上取整。', note: '图片最多 4MP；参考图分别计费。', source: 'bflFlux2Pricing',
    },
    '32:bfl-flux-3-video': {
      status: 'verified', headline: 'Full：HD $0.17/秒，FHD $0.29/秒', detail: 'Draft $0.06/秒；视频续接 Full HD/FHD $0.43/$0.54 每秒，Draft $0.12/秒。当前仓库仅接 t2v/首帧 i2v 的 Full 模式。', note: '1 credit = $0.01，API 与 Playground 同价。', source: 'bflFlux3Pricing',
    },
    '35:xai-grok-imagine-image-2.0': {
      status: 'verified', headline: 'Medium：1K $0.06、1.5K $0.07、2K $0.08/张', detail: 'Low：1K $0.04、1.5K $0.05、2K $0.06；编辑输入图另 $0.01/张。仓库固定 quality=medium。', note: '美元 xAI 原厂刊例。', source: 'xaiImagePricing',
    },
    '35:xai-grok-imagine-video-1.5': {
      status: 'verified', headline: '480P $0.08/秒；720P $0.14/秒；1080P $0.25/秒', detail: '输入首帧图另 $0.01/张；预设语音音频输入免费。', note: '美元 xAI 原厂刊例。', source: 'xaiVideoPricing',
    },

    '36:baidu-tts-large': {
      status: 'verified', headline: '预付 ¥2.0~¥4.0/千次；后付 ¥2.0~¥4.5/千次', detail: '每 120 GBK 字节计 1 次，单请求少于 1024 GBK 字节。预付 1000/5000/10000/50000/100000 千次的单价为 ¥4.0/¥3.5/¥3.0/¥2.5/¥2.0 每千次；后付月用量 0~6000/6000~30000/30000~60000/60000~150000/>150000 千次，对应 ¥4.5/¥3.8/¥3.0/¥2.5/¥2.0 每千次。', note: '大模型及臻品音库档位；实际成本取决于购买包或月阶梯。', source: 'baiduTtsPricing', extraSources: ['baiduTtsApi'],
    },
    '37:ernie-4.5-turbo-32k': {
      status: 'verified', headline: '输入 ¥0.8/M tokens；输出 ¥3.2/M tokens', detail: '联网搜索 ¥0.004/次；context 39936，prompt 最大 27648，completion 最大 12288。官方未列缓存价。', note: '真实厂商为百度智能云千帆，不是火山；当前仓库默认纯文本且不开联网搜索。', source: 'baiduErnie',
    },

    '38:wan3.0-video': {
      status: 'verified', headline: '480P $0.05/秒；720P $0.10/秒；1080P $0.20/秒', detail: '存在视频输入时，输入视频时长和输出视频时长都计费。', note: 'Alibaba Cloud Model Studio 新加坡区原厂刊例。', source: 'alibabaPricing',
    },
    '38:wan3.0-video-prime': {
      status: 'verified', headline: '480P $0.068/秒；720P $0.14/秒；1080P $0.28/秒', detail: '存在视频输入时，输入视频时长和输出视频时长都计费。', note: 'Prime 优速版；Alibaba Cloud Model Studio 新加坡区。', source: 'alibabaPricing',
    },
    '38:happyhorse-1.1-t2v': {
      status: 'verified', headline: '480P $0.07/秒；720P $0.14/秒；1080P $0.18/秒', detail: 'HappyHorse 1.1 文生视频，按输出视频秒数计费。', note: '新加坡区原厂刊例。', source: 'alibabaPricing',
    },
    '38:happyhorse-1.1-i2v': {
      status: 'verified', headline: '480P $0.07/秒；720P $0.14/秒；1080P $0.18/秒', detail: 'HappyHorse 1.1 首帧图生视频，费率与同版本其他模式一致。', note: '新加坡区原厂刊例。', source: 'alibabaPricing',
    },
    '38:happyhorse-1.1-r2v': {
      status: 'verified', headline: '480P $0.07/秒；720P $0.14/秒；1080P $0.18/秒', detail: 'HappyHorse 1.1 参考图生视频，费率与同版本其他模式一致。', note: '新加坡区原厂刊例。', source: 'alibabaHappyHorse11', extraSources: ['alibabaPricing'],
    },
    '38:happyhorse-1.0-t2v': {
      status: 'verified', headline: '720P $0.14/秒；1080P $0.24/秒', detail: 'HappyHorse 1.0 文生视频，按输出视频秒数计费。', note: '新加坡区原厂刊例。', source: 'alibabaPricing',
    },
    '38:happyhorse-1.0-i2v': {
      status: 'verified', headline: '720P $0.14/秒；1080P $0.24/秒', detail: 'HappyHorse 1.0 首帧图生视频，费率与同版本其他模式一致。', note: '新加坡区原厂刊例。', source: 'alibabaPricing',
    },
    '38:happyhorse-1.0-r2v': {
      status: 'verified', headline: '720P $0.14/秒；1080P $0.24/秒', detail: 'HappyHorse 1.0 参考图生视频，费率与同版本其他模式一致。', note: '新加坡区原厂刊例。', source: 'alibabaHappyHorse10', extraSources: ['alibabaPricing'],
    },
    '39:byteplus-mediakit': {
      status: 'verified', headline: 'Professional 图片高清 $0.006/次；人声分离 $0.01/输入分钟', detail: '图片高清基础价 $1/千次，Professional 换算系数 6，因此为 $6/千次；人声分离按输入媒体实际时长计费。', note: '两项当前本地能力均已找到对应官方现金价，不是待询价。',
      localBasis: '图片高清 ¥0.0432/次 = $0.006×7.2；人声分离 ¥0.072/分钟 = $0.01×7.2；各自售价都为成本×2。此渠道保留 4 位元小数精度，避免 ¥0.0432 被抹成 ¥0.04。',
      source: 'byteplusMediaKitPricing', extraSources: ['byteplusVodPricing', 'byteplusMediaKitDocs'],
    },
  };

  window.MODEL_OFFICIAL_PRICING = {
    meta: {
      auditedAt: '2026-09-30',
      scope: 'snapshot.js 中全部 72 个 channelId:modelId',
      currency: '保留厂商原币种：国内 CNY，海外 USD',
      status: {
        verified: '厂商官方产品页面与 SKU/能力已经确认；公开页面未展示金额时，具体现金价仍以控制台、合同或真实账单为准',
        review: '官方价格已经取得，但存在生命周期、旧价未更新、配额方式或本地固定折算偏差，选择前需确认',
        unverified: '尚未确认到对应的厂商官方产品页面、SKU 或一手来源',
      },
      localPricing: {
        entry: '管理员在渠道计费模板中以人民币元手工录入 cost 与 sale；代码不自动抓官网、不自动换汇，也不自动把 sale 设成 cost×2。',
        storage: '保存时按字段精度转换为分；普通价格保留到元后 2 位，部分极小单价使用更高精度。模型价存 studio_billing_template.prices，工具价存 studio_channel_model.capabilities.funcPrices。',
        provenance: '当前数据库未保存官方来源 URL、报价版本、汇率或推导公式；本页所写汇率和历史价来源只在数字可精确对应时作反推，并明确标注。',
        observedRule: '当前快照共有 260 组成本/售价；其中 40 组为 0/0 结构占位。余下 220 组正成本中 219 组恰为 sale=cost×2，唯一例外为百度 TTS 超小单价。该规律是人工配置现状，不是程序强制。',
      },
      note: '官方刊例、促销、资源包/合同价与后台内部 cost/sale 是不同口径；模型实际账单以所属账号、地区、计费模式和厂商控制台为准。',
    },
    sources,
    models,
  };
}());
