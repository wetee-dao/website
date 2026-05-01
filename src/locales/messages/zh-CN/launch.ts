export default {
  tokenEconomy: '代币经济',
  fairLaunch: '公平启动',
  crossChain: '跨链',
  economy: {
    title: 'TOKEN 机制说明',
    heroHtml:
      '本协议<strong>不发行任何代币</strong>，仅有治理代币 <strong>VOTE</strong> 用于参与治理投票。' +
      'VOTE 不用于支付、不用于分红、不作为资产承诺；它只用于治理投票权的度量。',
    usage: {
      title: 'VOTE 的用途',
      bodyHtml: '仅用于治理投票（OpenGov / 提案投票等）。<br />不用于支付、交易、质押收益、GAS 或任何消费结算。',
    },
    voteSplit: {
      title: 'VOTE 的产生与分配（按每笔消费）',
      table: {
        party: '参与方',
        vote: '获得 VOTE',
        desc: '说明',
      },
      rows: {
        consumer: {
          party: '消费者（支付方）',
          vote: '2× VOTE',
          desc: '任何消费都会产生 VOTE，消费者获得双倍 VOTE，用于参与治理投票。',
        },
        compute: {
          party: '算力节点（执行方）',
          vote: '1× VOTE',
          desc: '提供算力并完成任务/服务的节点获得 VOTE。',
        },
        consensus: {
          party: '共识打包节点',
          vote: '当前交易 VOTE × 1/3',
          desc: '交易被打包后，打包该交易的共识节点获得固定 VOTE（当前交易 VOTE × 1/3）。',
        },
      },
      note:
        '备注：这里的“当前交易 VOTE”指该笔消费产生的 VOTE 基数（消费者获得 2×，算力节点获得 1×，因此当前交易 VOTE = 2× + 1×）。' +
        '具体计量与参数以链上规则与 dApp 展示为准。',
      legend: {
        consumer: '消费者',
        compute: '算力节点',
        consensus: '共识打包节点',
      },
    },
    fees: {
      title: '链上协议收入与手续费分配',
      bodyHtml:
        '协议会对用户支付金额收取<strong>手续费</strong>作为链上协议收入。<br />' +
        '手续费收入按以下规则分配：<br />' +
        '- <strong>50%</strong>：转入国库（Treasury）<br />' +
        '- <strong>50%</strong>：直接分配给完成安全打包的共识节点（打包节点）',
    },
    treasury: {
      title: '国库治理',
      bodyHtml: '国库资金采用<strong>去中心化方式</strong>管理，由社区通过 OpenGov 等治理流程进行提案、投票与执行。',
    },
    govRole: {
      title: 'VOTE 在治理中的作用',
      bodyHtml:
        'VOTE 用于衡量治理投票权，参与治理可以影响（但不限于）：<br />' +
        '- 国库资金使用与拨付<br />' +
        '- 链上协议参数调整与升级决策<br />' +
        '- 治理提案、公投与各类 Track（轨道）投票<br />' +
        '<br />' +
        '<strong>重要规则：</strong>一旦你使用 VOTE 参与治理投票，对应的投票 VOTE 将<strong>直接永久销毁</strong>（不可撤销/不可恢复为可用余额）。<br />' +
        '<strong>原因：</strong>投票即销毁用于抑制 VOTE 的长期囤积，阻止“治理巨鲸”的诞生。',
    },
  },
}
