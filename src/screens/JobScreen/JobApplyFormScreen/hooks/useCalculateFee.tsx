import { useMutation } from '@tanstack/react-query';
import JobServices from '../../../../data/job/services/JobServices';
import dialogUtils from '../../../../utils/DialogUtils';
import { message } from 'antd';
import { CalculatePlatformFeeParams, JobFormParams, JobSubmitResponseResource, PlatformFeeResponseResource } from '../../../../data/job/models/job.types';
import { useRouter } from 'next/router';
import AuthJobRouteUtils from '../../../../data/auth/utils/AuthJobRouteUtils';
import Constants from '../../../../constants/Constants';
import JobRouteUtils from '../../../../data/job/utils/JobRouteUtils';

export default function useCalculateFee() {
  return useMutation<PlatformFeeResponseResource, Error, CalculatePlatformFeeParams>({
    mutationKey: ['CALCULATE_FEE'],
    mutationFn: async (params: CalculatePlatformFeeParams) => {
      return await new JobServices().onCalculateFee(params);
    },
    onSuccess: (data, variables) => {},
    onError: (error) => dialogUtils.showResponseError(error, 'CALCULATE_FEE'),
  });
}
