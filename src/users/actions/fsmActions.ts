// import { USER_ACTION } from './userActions';

// class FsmUserActions {
//   private static instanse: FsmUserActions;

//   private userStates: Map<number, keyof typeof USER_ACTION>;

//   constructor() {
//     if (FsmUserActions.instanse && FsmUserActions.instanse instanceof FsmUserActions) return FsmUserActions.instanse;
//     FsmUserActions.instanse = this;
//     return this;
//   }

//   transition(chatId: number, newState: keyof typeof USER_ACTION) {
//     if (this.userStates.has(chatId) && newState !== USER_ACTION.EMPTY) {
//         switch (newState) {
//             case USER_ACTION.WAITING_GOROSCOPE_TODAY:
//                 this.userStates.set(chatId, USER_ACTION.WAITING_GOROSCOPE_TODAY);
//                 break;
//             case USER_ACTION.WAITING_GOROSCOPE_TOMORROW:
//                 this.userStates.set(chatId, USER_ACTION.WAITING_GOROSCOPE_TOMORROW);
//                 break;
//             default:
//                 break;
//         }
//         return;
//     } else if (this.userStates.has(chatId) && newState === )
//   }

//   isAuthenticated() {
//     // return this.state === 'authenticated';
//   }

//   isError() {
//     // return this.state === 'error';
//   }
// }
