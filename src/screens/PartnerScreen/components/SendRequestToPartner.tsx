// import { Space, Typography } from "antd";

// // Component cho Send Request
// export const SendRequestToPartner = ({ partnerId }: { partnerId: number }) => {
//   const [isLiked, setIsLiked] = useState(false);
//   const partnerConnectModalRef = useRef<ModalizeHelperVisible>(null);
//   const updateCitizenModalRef = useRef<ModalizeHelperVisible>(null);
//   const { auth: userInfo } = useAccountContext();

//   const handleSendRequest = () => {
//     if (!userInfo?.citizenId) {
//       updateCitizenModalRef.current?.open();
//     } else {
//       partnerConnectModalRef.current?.open();
//     }
//   };

//   return (
//     <>
//       <Card className="send-request-card">
//         <Typography.Title level={4} className="nm-typo" style={{ marginBottom: 16 }}>
//           Gửi yêu cầu cho Đối tác này
//         </Typography.Title>
//         <Space direction="vertical" size={16} style={{ width: '100%' }}>
//           <Button
//             type="primary"
//             size="large"
//             onClick={handleSendRequest}
//             block
//             className="send-request-button"
//           >
//             Gửi yêu cầu công việc
//           </Button>
//           <Button
//             type="text"
//             size="large"
//             icon={<HeartOffIcon />}
//             onClick={() => setIsLiked(!isLiked)}
//             block
//             className={`favorite-button ${isLiked ? 'liked' : ''}`}
//             style={{ 
//               color: isLiked ? '#ff4d4f' : '#8c8c8c',
//               borderColor: isLiked ? '#ff4d4f' : '#d9d9d9'
//             }}
//           >
//             {isLiked ? 'Đã thích' : 'Yêu thích'}
//           </Button>
//         </Space>
//       </Card>
      
//       <PartnerConnectModal ref={partnerConnectModalRef} partnerId={partnerId} />
//       <UpdateCitizenIdModal
//         ref={updateCitizenModalRef}
//         title={'Xác thực để kết nối với đối tác'}
//         okText={'Kết nối với đối tác'}
//         subTitle={
//           'Vui lòng nhập CCCD/Mysign ID đã được xác thực thông qua Mysign ID để có thể kết nối với đối tác.'
//         }
//       />
//     </>
//   );
// };

export {};