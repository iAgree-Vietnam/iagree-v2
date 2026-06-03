import React from 'react';
import { Col, Row, Space, Typography } from 'antd';
import { FullJobResource } from '../../../../data/job/models/job.types';
import { JobDetailComponentProps } from '../JobDetailScreen';
import { JobParseUtils } from '@/src/data/job/utils/JobParseUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import Constants from '@/src/constants/Constants';

function JobProcessing(props: JobDetailComponentProps) {
    // const { jobQuery } = props;
    // const fullJobResource: FullJobResource = jobQuery.data;

    return (
        <div>
            <div className={'jobPartContainer'}>
                <div className="jobPartTitleContainer">
                    <div className="jobPartTitle" style={{ textAlign: 'center' }}>Đối tác đang thực hiện công việc</div>
                </div>
            </div>
        </div>
    );
}

export default JobProcessing;