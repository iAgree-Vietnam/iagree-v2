import { useCallback, useMemo } from "react";
import { RawUserProjectBidResource, RawUserProjectDealResource } from "@/src/data/job/models/job.raw";
import Constants from "@/src/constants/Constants";

interface UseJobBidsResult {
  dataReal: RawUserProjectDealResource[];
  isCurrentBid: boolean;
  isCanReply: boolean;
  isCurrentBidPartner: boolean;
  isCurrentBidClient: boolean;
  showOfferButton: boolean;
  disableOfferButton: boolean;
  checkCanReplyForPartner: (partnerId: number) => boolean;
  latestDeal: RawUserProjectDealResource | null;
  canSendOffer: boolean;
}

export function useJob(jobData: any, userInfo: any): UseJobBidsResult {
  const dataReal: RawUserProjectDealResource[] = useMemo(() => {
    const allDeals: RawUserProjectDealResource[] = [];
    
    jobData?.userProjectBids?.forEach((bid: any) => {
      if (bid.userProjectDeals && bid.userProjectDeals.length > 0) {
        bid.userProjectDeals.forEach((deal: any) => {
          allDeals.push({
            id: deal.dealId || deal.id,
            project_id: bid.projectId,
            user_id: bid.userId,
            application_letter: bid?.applicationLetter,
            application_file: bid.applicationFile,
            negotiate_price: deal.negotiatePrice || bid.negotiatePrice,
            description: deal.description || bid.description,
            number_accept: deal.numberAccept || bid.numberAccept,
            start_date: deal.startDate || bid.startDate,
            end_date: deal.endDate || bid.endDate,
            status: deal.status,
            created_at: deal.createdAt || bid.createdAt,
            updated_at: deal.updatedAt || bid.updatedAt,
            client_ip: deal.clientIp || bid.clientIp,
            deal_status: deal.status || bid.status,
            device_name: deal.deviceName || bid.deviceName,
            platform: deal.platform || bid.platform,
            type: deal.type || bid.type,
            user_project_bid_id: bid.id,
          });
        });
      }
    });
    
    return allDeals;
  }, [jobData]);

  // const isCurrentBid =
  //   dataReal?.[0]?.user_id === userInfo?.userId &&
  //   dataReal?.[0]?.status === 0;

  const isCurrentBid = useMemo(() => {
    return dataReal?.[0]?.user_id === userInfo.userId && dataReal?.[0].status === 0;
  }, [dataReal, userInfo]);

  const latestDeal = useMemo(() => {
    return dataReal.length > 0 ? dataReal[0] : null;
  }, [dataReal]);

  // const isCanReply = (() => {
  //   if (jobData?.createdByUserId === userInfo?.userId && dataReal.length === 0) {
  //     return true;
  //   }

  //   return (
  //     dataReal?.length > 0 &&
  //     dataReal[0].user_id === userInfo?.userId &&
  //     dataReal[0].status === 0
  //   );
  // })();

  const checkCanReplyForPartner = useCallback((partnerId: number) => {
    if (!jobData?.userProjectBids || !userInfo) return false;

    if (jobData?.createdByUserId !== userInfo.userId) return false;

    // find bid of specific partner
    const partnerBid = jobData?.userProjectBids?.find(
      (bid: any) => bid.userId === partnerId
    );

    if (!partnerBid) return false;

    // if no deal exist, client can send first deal
    if (!partnerBid.userProjectDeals || partnerBid.userProjectDeals.length === 0) {
      return jobData.createdByUserId === userInfo.userId;
    }

    const latestDeal = partnerBid.userProjectDeals[0];

    // client can only reply to partner's deals (type = 2) with status = 0
    // if partner accepted (type = 2 && deal_status = 1), client can only accept, not send new deal
    if (latestDeal.type === 2) {
      if (latestDeal.dealStatus === 1) {
        return false;
      }

      return latestDeal.status === 0;
    }

    return false;

    // const cannotReply = latestDeal.status === 0 && latestDeal.type === 1;

    // return !cannotReply;
  }, [jobData, userInfo]);

  const isCanReply = useMemo(() => {
    if (!userInfo || !jobData) return false;

    const isClient = jobData.createdByUserId === userInfo.userId;
    const isPartner = !!userInfo?.partner &&
                      jobData?.userProjectBids?.some(
                        (bid: any) => bid.userId === userInfo?.userId
                      );

    const latestDeal = dataReal[0];

    if (isClient) {
      if (dataReal.length === 0) {
        return true;
      }

      // const latestDeal = dataReal[0];

      // Can only reply to partner's deals (type = 2) with status = 0
      if (latestDeal.type === 2 && latestDeal.status === 0) {
        // If partner accepted, client can only accept, not send new offer
        return latestDeal.deal_status !== 1;
      }

      return false;
    } else if (isPartner) {
      if (dataReal.length === 0) return false;

      // const latestDeal = dataReal[0];

      // partner can only reply to client's deal (type = 1) with status = 0
      return latestDeal.type === 1 && latestDeal.status === 0;
    }

    return false;
  }, [dataReal, userInfo, jobData]);

  const isCurrentBidPartner = useMemo(() => {
    return !!userInfo?.partner && isCurrentBid;
  }, [userInfo, isCurrentBid]);

  const isCurrentBidClient = useMemo(() => {
    return !userInfo?.partner && isCurrentBid;
  }, [userInfo, isCurrentBid]);

  // const showOfferButton =
  //   !!userInfo?.partner &&
  //   dataReal.length > 0 &&
  //   jobData?.userProjectBids?.some(
  //     (bid: any) => bid.userId === userInfo?.userId
  //   );

  const showOfferButton = useMemo(() => {
    return !!userInfo.partner &&
            dataReal.length > 0 &&
            jobData?.userProjectBids?.some(
              (bid: any) => bid.userId === userInfo?.userId
            );
  }, [userInfo, dataReal, jobData]);

  // const disableOfferButton = dataReal?.[0]?.type === 2 && dataReal?.[0]?.status === 0;

  const disableOfferButton = useMemo(() => {
    if (!latestDeal) return true;
    
    const isClient = jobData.createdByUserId === userInfo.userId;
    const isPartner = !isClient;

    // user cannot reply to their own deals with status = 0
    if (isClient) {
      return latestDeal.type === 1 && latestDeal.status === 0;
    } else if (isPartner) {
      return latestDeal.type === 2 && latestDeal.status === 0;
    }

    return true;
  }, [latestDeal, userInfo, jobData]);

  const canSendOffer = useMemo(() => {
    return isCanReply && !disableOfferButton;
  }, [isCanReply, disableOfferButton]);

  return {
    dataReal,
    isCurrentBid,
    isCanReply,
    isCurrentBidPartner,
    isCurrentBidClient,
    showOfferButton,
    disableOfferButton,
    checkCanReplyForPartner,
    latestDeal,
    canSendOffer
  };
}