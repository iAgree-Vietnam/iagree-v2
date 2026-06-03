import React, { useEffect, useRef } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
// import Editor from 'ckeditor5-custom-build/build/ckeditor';
import ArrayUtils from '../../utils/ArrayUtils';



// status: 1 đăng tuyển 0 = nháp
//  

function TextEditor(props) {

    const toolbarRef = useRef(null);

    const {
        data,
        config,
        onChange = () => null,
        ckeditorRef = {
            current: null,
        },
    } = props;

    const handleScroll = () => {
        const toolbar = toolbarRef.current;
        if (!toolbar) return;

        toolbar.classList.toggle('sticky', window.scrollY > toolbar.offsetTop);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <CKEditor
                editor={Editor}
                config={config || editorConfiguration}
                data={data || ''}
                onReady={(editor) => {
                    toolbarRef.current = editor.ui.view.toolbar.element;
                    ckeditorRef.current = editor;
                    window.editor = editor;

                    const toolbarContainer = document.querySelector('.document-editor__toolbar');
                    if (toolbarContainer) {
                        toolbarContainer.replaceChildren(editor.ui.view.toolbar.element);
                    } else {
                        if (editor.ui.getEditableElement() && editor.ui.getEditableElement().parentElement) {
                            editor.ui.getEditableElement().parentElement.insertBefore(
                                editor.ui.view.toolbar.element,
                                editor.ui.getEditableElement(),
                            );
                        }
                    }
                }}
                onChange={(event, editor) => onChange(editor.getData())}
                onBlur={(event, editor) => onChange(editor.getData())}
                onFocus={(event, editor) => onChange(editor.getData())}
            />
        </div>
    );
}

const editorConfiguration = {
    toolbar: {
        viewportTopOffset: 100,
        shouldNotGroupWhenFull: true,
        items: [
            'fontFamily', 'fontSize', 'heading', 'alignment',
            '|', 'underline', 'strikethrough', 'bold', 'italic', 'fontBackgroundColor', 'fontColor', 'highlight',
            '|', 'insertTable', 'subscript', 'superscript', 'blockQuote', 'horizontalLine',
            '|', 'undo', 'redo', 'removeFormat', 'textNormalization', 'insertTemplate', 'footnote', 'tableOfContents',
            '-', 'todoList', 'bulletedList', 'numberedList', 'pageBreak', 'outdent', 'indent',
            '|', 'codeBlock', 'code', 'htmlEmbed', 'lineHeight', 'letterCase', 'findAndReplace', 'specialCharacters',
        ],
    },
    licenseKey: '',
    list: {
        properties: {
            styles: true,
            startIndex: true,
            reversed: true,
        },
    },
    alignment: {
        options: ['left', 'center', 'right', 'justify'],
    },
    heading: {
        options: [
            {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph',
            },
            {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1',
            },
            {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2',
            },
            {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3',
            },
            {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4',
            },
            {
                model: 'heading5',
                view: 'h5',
                title: 'Heading 5',
                class: 'ck-heading_heading5',
            },
            {
                model: 'heading6',
                view: 'h6',
                title: 'Heading 6',
                class: 'ck-heading_heading6',
            },
        ],
    },
    fontSize: {
        options: ArrayUtils.arrayRange(5, 100),
        supportAllValues: true,
    },
    fontFamily: {
        options: [
            'default',
            'Arial, Helvetica, sans-serif',
            'Courier New, Courier, monospace',
            'Georgia, serif',
            'Lucida Sans Unicode, Lucida Grande, sans-serif',
            'Tahoma, Geneva, sans-serif',
            'Times New Roman, Times, serif',
            'Trebuchet MS, Helvetica, sans-serif',
            'Verdana, Geneva, sans-serif',
        ],
        supportAllValues: true,
    },
    pagination: {
        pageWidth: '21cm',
        pageHeight: '29.7cm',

        pageMargins: {
            top: '20mm',
            bottom: '20mm',
            right: '12mm',
            left: '12mm',
        },
    },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    template: {
        definitions: [
            {
                title: 'Quốc hiệu & Tiêu ngữ',
                description: 'Cộng hòa xã hội chủ nghĩa Việt Nam - Độc lập tự do hạnh phúc',
                data: '<figure class="table"> <table class="ck-table-resized"> <colgroup><col style="width:50%;"><col style="width:50%;"></colgroup> <tbody> <tr> <td style="border:0px solid transparent;padding:0pt 5.4pt;vertical-align:top;"> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:Times New Roman, Times, serif;font-size:15px;">Dịch vụ Freelancer</span> </p> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:Times New Roman, Times, serif;font-size:15px;"><strong>Hạng mục thiết kế web:&nbsp;</strong></span> </p> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:Times New Roman, Times, serif;font-size:15px;"><strong>Hoàng Xuân Hiếu</strong></span> </p> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:Times New Roman, Times, serif;font-size:15px;"><strong>-----------------------</strong></span> </p> </td> <td style="border:0px solid transparent;padding:0pt 5.4pt;vertical-align:top;"> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:Times New Roman, Times, serif;font-size:15px;"><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></span> </p> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:Times New Roman, Times, serif;font-size:15px;"><strong>Độc lập – Tự do – Hạnh phúc</strong></span> </p> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:Times New Roman, Times, serif;font-size:15px;"><strong>======★★★=====</strong></span> </p> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:Times New Roman, Times, serif;font-size:15px;">Hà Nội<i>, ngày 28&nbsp; tháng&nbsp;</i>05<i> năm&nbsp;</i>2016</span> </p> </td> </tr> </tbody> </table> </figure>',
            },
            {
                title: 'Chữ ký',
                description: 'A longer description of the template',
                data: '<figure class="table"> <table class="ck-table-resized"> <colgroup><col style="width:50%;"><col style="width:50%;"></colgroup> <tbody> <tr> <td style="border-style:solid;border-width:0px;padding:0pt 5.4pt;vertical-align:top;"> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:\'Times New Roman\';font-size:12pt;"><strong>Người ký 1</strong></span> </p> <p> &nbsp; </p> </td> <td style="border-style:solid;border-width:0px;padding:0pt 5.4pt;vertical-align:top;"> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:\'Times New Roman\';font-size:12pt;"><strong>Người ký 2</strong></span> </p> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:\'Times New Roman\';font-size:12pt;"><strong>Chức vụ người ký 2</strong></span> </p> <p> &nbsp; </p> <p> &nbsp; </p> <p style="text-align:center;"> <span style="background-color:transparent;color:#000000;font-family:\'Times New Roman\';font-size:13pt;"><strong>Hoàng Xuân Hiếu</strong></span> </p> </td> </tr> </tbody> </table> </figure>',
            },
            {
                title: 'Mẫu giao diện 1',
                description: 'A longer description of the template',
                data: '<p>Data inserted into the content 3</p>',
            },
            {
                title: 'Mẫu giao diện 2',
                description: 'A longer description of the template',
                data: '<p>Data inserted into the content 4</p>',
            },
            {
                title: 'Mẫu giao diện 3',
                description: 'A longer description of the template',
                data: '<p>Data inserted into the content 5</p>',
            },
        ],
    },
};

export default TextEditor;
