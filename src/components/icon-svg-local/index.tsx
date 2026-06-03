import { useMemo } from "react";

import IC_USER from "./ic_user.svg";
import IC_DIAMOND from "./ic_diamond.svg";
import IC_LOG_OUT from "./ic_log_out.svg";
import IC_NOTIFICATION from "./ic_notification.svg";
import IC_PADLOCK from "./ic_padlock.svg";
import IC_WALLET from "./ic_wallet.svg";
import IC_SEARCH from "./ic_search.svg";
import IC_CLOCK from "./ic_clock.svg";
import IC_MONEY from "./ic_money.svg";
import IC_ARROW_RIGHT from "./ic_arrow_right.svg";
import IC_ARROW_LEFT from "./ic_arrow_left.svg";
import IC_CLOSE from "./ic_close.svg";
import IC_BAG from "./ic_bag.svg";
import IC_MONEY_BAG from "./ic_money_bag.svg";
import IC_CALENDAR from "./ic_calendar.svg";
import IC_HOME from "./ic_home.svg";
import IC_GROUP_USER from "./ic_group_user.svg";
import IC_DOCX from "./ic_docx.svg";
import IC_QUOTE from "./ic_quote.svg";
import IC_ARROW_UP from "./ic_arrow_up.svg";
import IC_SCROLL_DOWN_CURVE from "./ic_scroll_down_curve.svg";
import IC_LANGUAGE from "./ic_language.svg";
import IC_CERTIFICATE from "./ic_certificate.svg";
import IC_CITY from "./ic_city.svg";
import IC_INFO_DANGER from "./ic_info_danger.svg";
import IC_CHECK_SUCCESS from "./ic_check_success.svg";
import IC_MORE from "./ic_more.svg";
import IC_PDF from "./ic_pdf.svg";
import IC_GOOGLE from "./ic_google.svg";
import IC_JOB_PAYMENT from "./ic_job_payment.svg";
import IC_COIN_SHARE from "./ic_coin_share.svg";
import IC_NO_RESULT from "./ic_no_result.svg";
import IC_IMAGE_UPLOAD from "./ic_image_upload.svg";
import IC_TRANSACTION_HISTORY from "./ic_transaction_history.svg";
import IC_INCOME from "./ic_income.svg";
import IC_LOCATION from "./ic_location.svg";
import IC_ADD_PROJECT from "./ic_add_project.svg";
import IC_ADD_IMAGE_OR_FILE from "./ic_add_image_or_file.svg";
import IC_LOGO_ONLY_I from "./ic_logo_only_i.svg";
import IC_FILTER from "./ic_filter.svg";
import IC_CASE from "./ic_case.svg";
import IC_VERIFIED from "./ic_verified.svg";
import IC_ACCOUNT from "./ic_account.svg";
import IC_CHART from "./ic_chart.svg";
import IC_CORPORATE from "./ic_corporate.svg";
import IC_SUIT_CASE from "./ic_suit_case.svg";
import IC_QUESTION from "./ic_question.svg";
import IC_MORE_V2 from "./ic_more_v2.svg";
import IC_MESSENGER from "./ic_messenger.svg";
import IC_WHATSAPP from "./ic_whatsapp.svg";
import IC_OUTLOOK from "./ic_outlook.svg";
import IC_FACEBOOK from "./ic_facebook.svg";
import IC_INSTAGRAM from "./ic_instagram.svg";
import IC_LINKEDIN from "./ic_linkedin.svg";
import IC_ARROW_DOWN from "./ic_arrow_down.svg";

import IC_HOW_TO_USE from "./ic_how_to_use_connects.svg";
import IC_MORE_CHANCE from "./ic_more_chance_connects.svg";
import IC_QUESTION_V1 from "./ic_question_connects.svg";
import IC_REFUND_POLICY from "./ic_refund_policy_connects.svg";
import IC_TAKE_A_CHANCE from "./ic_take_a_chance_connects.svg";
import IC_TRACK_AND_MANAGE from "./ic_track_and_manage_connects.svg";
import IC_ARROW_DOWN_2 from "./ic_arrow_down_2.svg";
import IC_ARROW_UP_2 from "./ic_arrow_up_2.svg";
import IC_ARROW_RIGHT_2 from "./ic_arrow_right_2.svg";
import IC_ARROW_RIGHT_3 from "./ic_arrow_right_3.svg";
import IC_REDO from "./ic_redo.svg";
import IC_UNDO from "./ic_undo.svg";
import IC_NEXT_STEP from "./ic_next_step.svg";
import IC_LOCK from "./ic_lock.svg";
import IC_PEOPLE from "./ic_people.svg";
import IC_TIMER from "./ic_timer.svg";
import IC_ZALO from "./ic_zalo.svg";
import IC_PRO_PARTNER from "./ic_pro.svg";
import IC_ELITE_PARTNER from "./ic_elite.svg";

export const IconSvg = {
  IC_DIAMOND,
  IC_LOG_OUT,
  IC_NOTIFICATION,
  IC_PADLOCK,
  IC_USER,
  IC_WALLET,
  IC_SEARCH,
  IC_CLOCK,
  IC_MONEY,
  IC_ARROW_RIGHT,
  IC_ARROW_LEFT,
  IC_CLOSE,
  IC_BAG,
  IC_MONEY_BAG,
  IC_CALENDAR,
  IC_HOME,
  IC_GROUP_USER,
  IC_DOCX,
  IC_QUOTE,
  IC_ARROW_UP,
  IC_SCROLL_DOWN_CURVE,
  IC_LANGUAGE,
  IC_CERTIFICATE,
  IC_CITY,
  IC_INFO_DANGER,
  IC_CHECK_SUCCESS,
  IC_MORE,
  IC_PDF,
  IC_GOOGLE,
  IC_JOB_PAYMENT,
  IC_COIN_SHARE,
  IC_NO_RESULT,
  IC_IMAGE_UPLOAD,
  IC_TRANSACTION_HISTORY,
  IC_INCOME,
  IC_LOCATION,
  IC_ADD_PROJECT,
  IC_ADD_IMAGE_OR_FILE,
  IC_LOGO_ONLY_I,
  IC_FILTER,
  IC_CASE,
  IC_VERIFIED,
  IC_ACCOUNT,
  IC_CHART,
  IC_CORPORATE,
  IC_SUIT_CASE,
  IC_QUESTION,
  IC_MORE_V2,
  IC_MESSENGER,
  IC_WHATSAPP,
  IC_OUTLOOK,
  IC_FACEBOOK,
  IC_INSTAGRAM,
  IC_LINKEDIN,
  IC_ARROW_DOWN,
  IC_HOW_TO_USE,
  IC_MORE_CHANCE,
  IC_QUESTION_V1,
  IC_REFUND_POLICY,
  IC_TAKE_A_CHANCE,
  IC_TRACK_AND_MANAGE,
  IC_ARROW_DOWN_2,
  IC_ARROW_UP_2,
  IC_ARROW_RIGHT_2,
  IC_ARROW_RIGHT_3,
  IC_UNDO,
  IC_REDO,
  IC_NEXT_STEP,
  IC_LOCK,
  IC_PEOPLE,
  IC_TIMER,
  IC_ZALO,
  IC_PRO_PARTNER,
  IC_ELITE_PARTNER,
};

export type IconSvgTypes = keyof typeof IconSvg;

interface IconSvgLocalProps {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  className?: string;
  onClick?: () => void;
  name: IconSvgTypes;
}

export const IconSvgLocal = (props: IconSvgLocalProps) => {
  const { name, width = 16, height = 16, fill = "#25272D", ...rest } = props;
  const Icon = useMemo(() => {
    return IconSvg[name];
  }, [name]);

  return (
    <Icon
      fill={fill}
      width={width}
      height={height}
      onClick={props.onClick}
      {...rest}
    />
  );
};

