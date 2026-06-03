"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Typography, Row, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Head from "next/head";
import { Breadcrumb } from "antd";
import RootLayout from "@/src/layouts/RootLayout";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { useAccountContext } from "@/src/contexts/AccountContext";
// import { ArrivalMeta, ChatMainArea } from "./components/ChatMainArea";
import { ChatSidebar } from "./components/ChatSideBar";
import { ChatProfileSidebar } from "./components/ChatProfileBar";
import {
  ListRoomChatOfUser,
  MessageItemsResource,
} from "@/src/data/message/models/message.types";
import { useSendMessages } from "./hooks/useSendMessages";
import useFetchRoomChatOfUser from "./hooks/useFetchRoomChatOfUser";
import { useQueryClient } from "@tanstack/react-query";
import { first, isEmpty, uniq, uniqBy } from "lodash";
import Constants from "@/src/constants/Constants";
import { RcFile } from "antd/es/upload";
import { useAppSelector } from "@/src/hooks/store";
import { useRoomInfoInfinite } from "@/src/hooks/useRoomInfoInfinite";
import { addBy, increment } from "@/src/store/slices/chat";
import { useDispatch } from "react-redux";
import { ArrivalMeta, ChatMainArea } from "./components/ChatMainAreaV2";
import MessageServices from "@/src/data/message/services/MessageServices";
import { useRouter } from "next/router";
import { useChatSocket } from "@/src/hooks/useChatSocket";

export const PER_PAGE = 50;

function ChatScreenV2() {
  const [listChats, setListChats] = useState<ListRoomChatOfUser[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [key, setKey] = useState(-1);
  const [refetchKey, setRefetchKey] = useState(-1);

  const [isChatListDrawerOpen, setIsChatListDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [selectedChatRoom, setSelectedChatRoom] = useState();
  const [isSending, setIsSending] = useState(false);
  const accountContext = useAccountContext();
  const [files, setFiles] = useState<RcFile[]>([]); // State để lưu trữ các tệp đã chọn
  const [arrival, setArrival] = useState<ArrivalMeta | null>(null);
  const dispatch = useDispatch();

  const currentUserId = accountContext?.auth?.userId || 0;

  const fullProfileResource = accountContext.auth;

  const { data: roomChatData, isLoading: isRoomChatLoading } =
    useFetchRoomChatOfUser(currentUserId, refetchKey);

  const router = useRouter(); // useRouter hook for accessing queryParams

  const getLastMessageTime = (
    messages: MessageItemsResource | null
  ): string => {
    const lastMessage = messages;
    return lastMessage?.createdAt || "";
  };

  const sortedChats = useMemo(() => {
    return [...listChats].sort((a, b) => {
      const timeA = getLastMessageTime(a?.chatRoom?.message);
      const timeB = getLastMessageTime(b?.chatRoom?.message);
      return timeB.localeCompare(timeA);
    });
  }, [listChats]);

  useEffect(() => {
    if (!sortedChats || sortedChats.length === 0) return;

    // Check if chat_room query param exists
    const { chat_room } = router.query;

    // If no queryParam, set the first room as default
    if (!chat_room && sortedChats.length > 0) {
      setSelectedChatId(first(sortedChats)?.chatRoomId || ""); // Set first chat room ID
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            chat_room: first(sortedChats)?.chatRoomId,
          }, // Thêm chat_room vào query
        },
        undefined,
        { shallow: true }
      ); // shallow: true sẽ ngăn việc tải lại trang
    } else if (chat_room) {
      // If there's a chat_room param, set selectedChatId accordingly
      setSelectedChatId(chat_room as string);
      // router.push({
      //   pathname: router.pathname,
      //   query: { ...router.query, chat_room: chat_room }, // Thêm chat_room vào query
      // }, undefined, { shallow: true }); // shallow: true sẽ ngăn việc tải lại trang
    }
  }, [JSON.stringify(router.query), sortedChats]);

  const isPartner = useMemo(() => {
    return fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;
  }, [fullProfileResource]);

  const selectedChatFromList = useMemo(() => {
    return listChats.find((chat) => chat.roomId === selectedChatId);
  }, [listChats, selectedChatId]);

  const [isInitialized, setIsInitialized] = useState(false);
  const isFirstLoadRef = useRef(true);

  const pageMessages = useAppSelector((state) => state.chat.pageMessages);

  const {
    data: roomInfoData,
    isLoading: isLoadingRoomInfoData,
    refetch: refetchRoomInfo,
    reset,
  } = useRoomInfoInfinite({
    selectedChatId,
    pageMessages,
    perPage: PER_PAGE,
    extraParams: {},
  });

  // Initialize - fetch room list only once when component mounts
  useEffect(() => {
    if (currentUserId && !isInitialized) {
      setIsInitialized(true);
    }
  }, [currentUserId, isInitialized]);
  // Handle room list data when it's available
  useEffect(() => {
    if (roomChatData && !isRoomChatLoading) {
      const listChat = (roomChatData as any)?.parsedData;
      setListChats(listChat);

      // Set first chat as selected only on first load
      if (listChat.length > 0 && isFirstLoadRef.current) {
        const firstChatId = listChat[0]?.chatRoomId;
        if (firstChatId) {
          setSelectedChatId(firstChatId);
          isFirstLoadRef.current = false;
        }
      }
    }
  }, [JSON.stringify(roomChatData), isRoomChatLoading]);

  useEffect(() => {
    if (roomInfoData && !isLoadingRoomInfoData) {
      setSelectedChatRoom(roomInfoData as any);
    }
  }, [roomInfoData, isLoadingRoomInfoData]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1199);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const [lastMess, setLastMess] = useState<MessageItemsResource>();
  const { lastMessage, arrival: arrivalSocket } = useChatSocket(selectedChatId);
  // console.log("lastMessage", lastMessage);

  useEffect(() => {
    setLastMess(lastMessage);
    setArrival(arrivalSocket as ArrivalMeta);
    setRefetchKey(refetchKey + 1);
    // }
  }, [JSON.stringify(arrival), JSON.stringify(lastMessage)]);
  // console.log("selectedChatRoom", selectedChatRoom);

  useEffect(() => {
    if (!isEmpty(selectedChatRoom)) {
      setSelectedChatRoom((prevChatRoom: any) => {
        // const list = uniqBy(
        //   [
        //     ...(prevChatRoom?.items || []), // Duy trì các items cũ nếu có
        //     lastMess,
        //   ],
        //   "id"
        // );

        // const prevDataSet = {
        //   ...prevChatRoom, // Giữ lại toàn bộ các field khác trong selectedChatRoom
        //   items: ArrayUtils.sortByDateDesc(list, "createdAt", "asc"),
        // };

        // return prevDataSet;
        const prevDataSet = {
          ...prevChatRoom, // Giữ lại toàn bộ các field khác trong selectedChatRoom
          items: uniqBy(
            [
              ...(prevChatRoom?.items || []), // Duy trì các items cũ nếu có
              lastMess,
            ],
            "id"
          ),
        };

        return prevDataSet;

      });
    }
  }, [JSON.stringify(lastMess), JSON.stringify(selectedChatRoom)]);
  const submitMessage = useSendMessages(selectedChatId);
  const [replyId, setReplyId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const handleSendMessage = async (files?: RcFile[]) => {
    if ((!isEmpty(messageText) || !isEmpty(files)) && !isSending) {
      setIsSending(true);
      try {
        await submitMessage.mutateAsync({
          replyId: replyId || "",
          ...(!isEmpty(messageText) ? { content: messageText } : {}),
          files,
        });

        setMessageText("");
        setReplyId(null);

        await Promise.all([
          queryClient.invalidateQueries([
            "FETCH_ROOM_CHAT_OF_USER",
            currentUserId,
          ]),
          queryClient.invalidateQueries(["FETCH_ROOM_INFO", selectedChatId]),
          refetchRoomInfo(),
        ]);
        if (!isEmpty(files)) {
          setKey(key + 1);
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(files);
    }
  };

  const handleChatSelect = (chatId: string) => {
    dispatch(addBy(1));

    if (chatId !== selectedChatId) {
      setMessageText("");
      setSelectedChatId(chatId);
      setSelectedChatRoom(undefined);
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, chat_room: chatId }, // Thêm chat_room vào query
        },
        undefined,
        { shallow: true }
      ); // shallow: true sẽ ngăn việc tải lại trang

      if (isMobile) {
        setIsChatListDrawerOpen(false);
      }
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleMessageTextChange = (text: string) => {
    setMessageText(text);
  };

  const toggleChatListDrawer = () => {
    setIsChatListDrawerOpen(!isChatListDrawerOpen);
  };

  const toggleProfileDrawer = () => {
    setIsProfileDrawerOpen(!isProfileDrawerOpen);
  };

  // Show loading state while initializing
  // if (!isInitialized || listRoomChatOfUser.isLoading) {
  if (!isInitialized || isRoomChatLoading) {
    return (
      <RootLayout>
        <Head>
          <title>Tin nhắn</title>
        </Head>
        <section className={"breadcrumbContainer"}>
          <div className="contentWrapper">
            <Breadcrumb
              items={[
                {
                  title: (
                    <>
                      <IconSvgLocal name={"IC_HOME"} />
                      <span>Trang chủ</span>
                    </>
                  ),
                  href: "/",
                },
                { title: "Tin nhắn" },
              ]}
            />
          </div>
        </section>
        <section style={{ marginBottom: "12px" }}>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Typography.Text>Đang tải tin nhắn...</Typography.Text>
          </div>
        </section>
      </RootLayout>
    );
  }

  const getDetailReply = async (messId: string, roomId: string) => {
    const result = await new MessageServices().getPageReplyMess(
      roomId || "",
      messId,
      {
        page: 1,
        per_page: PER_PAGE,
      }
    );
    const page = result?.data?.page;
    if (page && pageMessages < page) {
      // Dùng vòng for để dispatch theo chu kỳ
      for (let i = pageMessages; i < page; i++) {
        // Dispatch action mỗi 3 giây
        dispatch(increment());

        // Delay 3 giây giữa các lần dispatch
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  };

  return (
    <RootLayout>
      <Head>
        <title>Tin nhắn</title>
      </Head>
      <section className={"breadcrumbContainer"}>
        {/* <TestChat /> */}
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Tin nhắn</span>
                  </>
                ),
                href: "/",
              },
              { title: "Tin nhắn" },
            ]}
          />
        </div>
      </section>

      <section style={{ marginBottom: "12px" }}>
        <div>
          <div>
            {!listChats || listChats.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                }}
              >
                <Typography.Title level={4} style={{ marginBottom: "16px" }}>
                  Chưa có tin nhắn nào
                </Typography.Title>
                <Typography.Text type="secondary">
                  Bạn chưa có cuộc trò chuyện nào. Hãy bắt đầu một cuộc trò
                  chuyện mới.
                </Typography.Text>
              </div>
            ) : (
              <>
                {/* Mobile/Tablet Layout */}
                {isMobile ? (
                  <div
                    style={{
                      height: "80vh",
                      maxHeight: "800px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {/* Mobile Header with Menu and Profile buttons */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        background: "#fff",
                      }}
                    >
                      <Button
                        type="text"
                        onClick={toggleChatListDrawer}
                        style={{
                          fontSize: "16px",
                          borderRadius: "50%",
                          border: "1.5px solid #09993E",
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        icon={<MenuOutlined />}
                      />
                      <Typography.Title
                        level={5}
                        style={{ margin: 0, flex: 1, textAlign: "center" }}
                      >
                        Tin nhắn
                      </Typography.Title>
                      <Button
                        type="text"
                        onClick={toggleProfileDrawer}
                        style={{
                          fontSize: "16px",
                          borderRadius: "50%",
                          border: "1.5px solid #09993E",
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        }}
                      >
                        <IconSvgLocal name="IC_LOGO_ONLY_I" />
                      </Button>
                    </div>

                    {/* Main Chat Area - Full Screen */}
                    <div style={{ height: "calc(100% - 65px)", width: "100%" }}>
                      <ChatMainArea
                        selectedChat={selectedChatRoom}
                        currentUserId={currentUserId}
                        messageText={messageText}
                        fullProfileResource={fullProfileResource || null}
                        onMessageTextChange={handleMessageTextChange}
                        onSendMessage={(files?: RcFile[]) => {
                          handleSendMessage(files);
                        }}
                        files={files}
                        setFiles={setFiles}
                        onKeyPress={() => {
                          handleKeyPress;
                        }}
                        onReplyMessage={async (messageId: string) =>
                          setReplyId(messageId)
                        }
                        isLoading={isRoomChatLoading || isLoadingRoomInfoData}
                        isPartner={isPartner}
                        incomingArrival={arrival ?? undefined}
                        getDetailReply={(messId: string, localChat: string) =>
                          getDetailReply(messId, localChat)
                        }
                        selectedChatFromList={selectedChatFromList}
                        disabled={roomInfoData?.status === "INACTIVE"}
                      />
                    </div>

                    {/* Chat List Drawer */}
                    <Drawer
                      title="Danh sách tin nhắn"
                      placement="left"
                      onClose={() => setIsChatListDrawerOpen(false)}
                      open={isChatListDrawerOpen}
                      width={280}
                      styles={{
                        body: { padding: 0 },
                        header: { paddingBottom: "16px" },
                      }}
                    >
                      <ChatSidebar
                        isPartner={isPartner}
                        chats={sortedChats}
                        selectedChatId={selectedChatId || ""}
                        searchQuery={searchQuery}
                        onChatSelect={handleChatSelect}
                        onSearchChange={handleSearchChange}
                        fullProfileResource={fullProfileResource}
                      />
                    </Drawer>

                    {/* Profile Drawer */}
                    <Drawer
                      title="Thông tin người dùng"
                      placement="right"
                      onClose={() => setIsProfileDrawerOpen(false)}
                      open={isProfileDrawerOpen}
                      width={320}
                      styles={{
                        body: { padding: 0 },
                        header: { paddingBottom: "16px" },
                      }}
                    >
                      <ChatProfileSidebar
                        key={key}
                        roomId={
                          selectedChatFromList?.chatRoomId! || selectedChatId
                        }
                        disabled={roomInfoData?.status == "INACTIVE"}
                        currentUserId={currentUserId}
                        chatReceiverInfo={(selectedChatRoom as any)?.infoDetail}
                      />
                    </Drawer>
                  </div>
                ) : (
                  /* Desktop Layout */
                  <Row
                    gutter={24}
                    style={{
                      height: "80vh",
                      maxHeight: "800px",
                      width: "100%",
                      gap: "3px",
                    }}
                  >
                    {/* Left Sidebar - Chat List */}
                    <ChatSidebar
                      chats={sortedChats}
                      isPartner={isPartner}
                      selectedChatId={selectedChatId || ""}
                      searchQuery={searchQuery}
                      onChatSelect={handleChatSelect}
                      onSearchChange={handleSearchChange}
                      fullProfileResource={fullProfileResource}
                    />

                    {/* Main Chat Area */}
                    <ChatMainArea
                      selectedChat={selectedChatRoom}
                      currentUserId={currentUserId}
                      messageText={messageText}
                      onMessageTextChange={handleMessageTextChange}
                      // onSendMessage={handleSendMessage}
                      onSendMessage={(files?: RcFile[]) =>
                        handleSendMessage(files)
                      }
                      files={files}
                      setFiles={setFiles}
                      onKeyPress={handleKeyPress}
                      onReplyMessage={async (messageId: string) =>
                        setReplyId(messageId)
                      }
                      isLoading={isLoadingRoomInfoData}
                      isPartner={isPartner}
                      incomingArrival={arrival ?? undefined}
                      getDetailReply={(messId: string, localChat: string) =>
                        getDetailReply(messId, localChat)
                      }
                      fullProfileResource={fullProfileResource}
                      selectedChatFromList={selectedChatFromList}
                      disabled={roomInfoData?.status === "INACTIVE"}
                    />

                    {/* Right Sidebar - User Profile */}
                    <ChatProfileSidebar
                      roomId={
                        selectedChatFromList?.chatRoomId! || selectedChatId
                      }
                      currentUserId={currentUserId}
                      chatReceiverInfo={(selectedChatRoom as any)?.infoDetail}
                      key={key}
                      disabled={roomInfoData?.status == "INACTIVE"}
                    />
                  </Row>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </RootLayout>
  );
}

export default ChatScreenV2;
