<!-- <template> -->
<!--             <b-badge -->
<!--               v-for="(tx, i) in initData(data.item.block, )" -->
<!--               variant="none" -->
<!--               id="transaction" -->
<!--               :key="i" -->
<!--               > -->
<!--               <b-avatar-group> -->
<!--               <b-avatar -->
<!--               v-for="(msg, j) in tx.messages" -->
<!--               :key="j" -->
<!--               id="message" -->
<!--               :size="42" :variant="`light-${msgColor(msg)[0]}`" -->
<!--               :badge="`${i+1}`" -->
<!--               badge-top badge-right :badge-variant="`${msgColor(msg)[0]}`" -->
<!--               v-b-tooltip :title="`${msg.typeUrl}`" -->
<!--              v-b-tooltip.hover.v-dark -->
<!--               > -->

<!--                 <b-icon-cash-stack v-if="msg.typeUrl == '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.authz.v1beta1.MsgExec'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.authz.v1beta1.MsgRevoke'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.authz.v1beta1.MsgGrant'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1beta1.MsgDeposit'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1beta1.MsgSubmitProposal'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1beta1.MsgVote'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1beta1.MsgVoteWeighed'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1.MsgDeposit'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1.MsgSubmitProposal'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1.MsgVote'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.gov.v1.MsgVoteWeighed'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgCreateGroup'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgCreateGroupPolicy'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgCreateGroupWithPolicy'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgExec'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgLeaveGroup'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgSubmitProposal'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupAdmin'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupMembers'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupMetadata'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupPolicyAdmin'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgUpdateGroupPolicyMetadata'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgVote'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.group.v1.MsgWithdrawProposal'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.nft.v1beta1.MsgSend'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.slashing.v1beta1.MsgUnjail'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.feegrant.v1beta1.MsgGrantAllowance'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.feegrant.v1beta1.MsgRevokeAllowance'"/> -->
<!--                 <b-icon-person-plus v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgCreateValidator'"/> -->
<!--                 <b-icon-person-check v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgEditValidator'"/> -->
<!--                 <b-icon-person-check v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation'"/> -->
<!--                 <b-icon-person-check v-else-if="msg.typeUrl == '/cosmos.upgrade.v1beta1.MsgCancelUpgrade'"/> -->
<!--                 <b-icon-person-check v-else-if="msg.typeUrl == '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade'"/> -->
<!--                 <b-icon-cash-stack v-else-if="msg.typeUrl == '/cosmos.bank.v1beta1.MsgMultiSend'"/> -->
<!--                 <b-icon-send v-else-if="msg.typeUrl == '/cosmos.bank.v1beta1.MsgSend'"/> -->
<!--                 <b-icon-cash v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgDelegate'"/> -->
<!--                 <b-icon-clipboard-data v-else-if="msg.typeUrl == '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission'"/> -->
<!--                 <b-icon-clipboard-data v-else-if="msg.typeUrl == '/cosmos.distribution.v1beta1.MsgFundCommunityPool'"/> -->
<!--                 <b-icon-clipboard-data v-else-if="msg.typeUrl == '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress'"/> -->
<!--                 <b-icon-clipboard-data v-else-if="msg.typeUrl == '/cosmos.evidence.v1beta1.MsgSubmitEvidence'"/> -->
<!--                 <b-icon-eject v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgUndelegate'"/> -->
<!--                 <b-icon-file-diff v-else-if="msg.typeUrl == '/cosmos.staking.v1beta1.MsgBeginRedelegate'"/> -->
<!--                 <b-icon-box-arrow-up v-else-if="msg.typeUrl == '/ibc.applications.transfer.v1.MsgTransfer'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgAcknowledgement'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelCloseConfirm'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelCloseInit'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelOpenAck'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelOpenConfirm'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelOpenInit'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgChannelOpenTry'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgRecvPacket'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgTimeout'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.channel.v1.MsgTimeoutOnClose'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.client.v1.MsgCreateClient'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.client.v1.MsgSubmitMisbehaviour'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.client.v1.MsgUpdateClient'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.client.v1.MsgUpgradeClient'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.connection.v1.MsgConnectionOpenAck'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.connection.v1.MsgConnectionOpenConfirm'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.connection.v1.MsgConnectionOpenInit'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ibc.core.connection.v1.MsgConnectionOpenTry'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.vesting.v1beta1.MsgCreateVestingAccount'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.vesting.v1beta1.MsgCreatePeriodicVestingAccount'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/cosmos.vesting.v1beta1.MsgCreatePermanentLockedAccount'"/> -->

<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCancelAllOrders'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCancelMarketMakingOrder'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCancelOrder'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCreatePair'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCreatePoolCapped'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgCreatePool'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgDeposit'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgWithdraw'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgOrderLimit'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgOrderMarket'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.liquidity.MsgOrderMarketMaking'"/> -->

<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.claim.MsgClaim'"/> -->

<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.oracle.MsgPricesData'"/> -->

<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgBuyName'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgSetName'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgSellName'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgDeleteName'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgDeleteThread'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.ons.MsgAddThread'"/> -->

<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgRequestLoan'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgApproveLoan'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgRepayLoan'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgLiquidateLoan'"/> -->
<!--                 <b-icon-play v-else-if="msg.typeUrl == '/ollo.laon.MsgCancelLoan'"/> -->

<!--                 <b-icon-arrow-down v-else/> -->
<!--                 </b-avatar> -->
<!--               </b-avatar-group> -->
<!--             </b-badge> -->
<!--             </template> -->
