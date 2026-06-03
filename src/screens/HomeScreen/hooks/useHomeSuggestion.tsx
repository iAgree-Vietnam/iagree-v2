import { useQuery } from '@tanstack/react-query';
import { DefinedUseQueryResult } from '@tanstack/react-query/src/types';
import _ from 'lodash';
import { HomeSuggestResponse } from '@/src/data/home/models/home.types';
import HomeSuggestServices from '@/src/data/home/services/HomeSuggestServices';

// type useHomeSuggestionProps = {
//     search: string | null;
// }

// export default function useHomeSuggestion(props: useHomeSuggestionProps): DefinedUseQueryResult<HomeSuggestResponse> {
export default function useHomeSuggestion(keyword: string | null, key: string | null): DefinedUseQueryResult<HomeSuggestResponse> {

    // const { search } = props;
    const search = keyword;
    const keyType = key;

    //@ts-ignore
    return useQuery({
        //@ts-ignore
        queryKey: ['HOME_SUGGESTION', search],
        queryFn: async () => {
            const queryParams = { name: search || '', key: keyType };

            // return new HomeSuggestServices().search(queryParams);

            const response = await new HomeSuggestServices().search(queryParams);

            return response;
        },
        initialData: { name: '', templates: [], jobs: [], partners: [] },
        enabled: !_.isEmpty(search),
    });

}
