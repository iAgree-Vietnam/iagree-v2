import { useMutation } from "@tanstack/react-query";
import TemplateServices from "@/src/data/template/services/TemplateServices";
import _ from "lodash";
import dialogUtils from "@/src/utils/DialogUtils";
import { DocumentDirectPreviewParams } from "@/src/data/document/models/document.types";

interface UseDocumentDirectPreviewOptions {
  onSuccess: (fileUrl: string, variables: DocumentDirectPreviewParams) => void;
}

export default function useDocumentDirectPreview(
  options: UseDocumentDirectPreviewOptions
) {
  return useMutation({
    mutationKey: ["DOCUMENT_DIRECT_PREVIEW"],
    mutationFn: (variables: DocumentDirectPreviewParams) =>
      new TemplateServices().onDirectPreview(variables.body),
    onSuccess: (data, variables, context) => {
      if (_.isFunction(options.onSuccess))
        options.onSuccess(data as unknown as string, variables);
    },
    onError: (error) =>
      dialogUtils.showResponseError(error, "DOCUMENT_DIRECT_PREVIEW"),
  });
}
