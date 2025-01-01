import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { D3Editor } from "./D3Editor";
import "./BoardEditor.css";
import { useSelector } from "react-redux";

const CATEGORIES = [
  { id: "announcement", name: "공지사항" },
  { id: "qna", name: "질문답변" },
  { id: "free", name: "자유주제" },
  { id: "mailing", name: "매일메일" },
];

const BoardEditor = () => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const d3EditorRef = useRef(null);
  const [showD3Editor, setShowD3Editor] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
    if (!editorRef.current) return;

    window.scrollTo(0, 0);

    const { Editor } = window.toastui;
    const { uml, chart, codeSyntaxHighlight } = Editor.plugin;

    const editor = new Editor({
      el: editorRef.current,
      height: "600px",
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      plugins: [
        [uml, { rendererURL: "http://www.plantuml.com/plantuml/png/" }],
        [
          chart,
          {
            width: 700, // max-w-4xl에 맞춤
            height: 350, // 2:1 비율 유지
            minWidth: 500, // 모바일 고려
            minHeight: 300, // 모바일 고려
            maxWidth: 700, // max-w-4xl과 동일
            maxHeight: 350, // 2:1 비율 유지
          },
        ],
        [codeSyntaxHighlight],
      ],
      toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task", "indent", "outdent"],
        ["table", "image", "link"],
        ["code", "codeblock"],
        [
          {
            name: "drawing",
            tooltip: "그리기 도구",
            command: "drawingTool",
            text: "🎨",
          },
          {
            name: "uml",
            tooltip: "UML 다이어그램",
            command: "umlDiagram",
            text: "📊",
          },
          {
            name: "chart",
            tooltip: "차트 삽입",
            command: "insertChart",
            text: "📈",
          },
        ],
        [
          {
            name: "d3-editor",
            tooltip: "D3 에디터",
            command: "openD3Editor",
            text: "✏️",
          },
        ],
      ],
      hooks: {
        addImageBlobHook: handleImageUpload,
      },
    });

    // D3Editor 커맨드 추가
    editor.addCommand("wysiwyg", "openD3Editor", () => {
      setShowD3Editor(true);
      setShowOverlay(true);
      if (!d3EditorRef.current) {
        setTimeout(() => {
          d3EditorRef.current = new D3Editor(editor, handleCloseD3Editor);
        }, 0);
      }
    });

    editor.addCommand("markdown", "openD3Editor", () => {
      setShowD3Editor(true);
      setShowOverlay(true);
      if (!d3EditorRef.current) {
        setTimeout(() => {
          d3EditorRef.current = new D3Editor(editor, handleCloseD3Editor);
        }, 0);
      }
    });

    // 나머지 커스텀 커맨드 추가
    addCustomCommands(editor);

    editorInstanceRef.current = editor;

    // Drawing Tool 모달 HTML 추가
    const modalHtml = `
    <div id="imageEditorPopup" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div id="tui-image-editor"></div>
      <div style="text-align: right; padding: 10px;">
        <button onclick="window.insertDrawingAndClose()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">삽입</button>
        <button onclick="window.closeDrawingTool()" class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">취소</button>
      </div>
    </div>
  `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // 전역 함수들 정의
    window.createWhiteCanvas = (width, height) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      return canvas.toDataURL();
    };

    window.imageEditor = new window.tui.ImageEditor("#tui-image-editor", {
      includeUI: {
        loadImage: {
          path: window.createWhiteCanvas(1000, 600),
          name: "Blank",
        },
        uiSize: {
          width: "1000px",
          height: "650px",
        },
        menuBarPosition: "left",
      },
      cssMaxWidth: 1000,
      cssMaxHeight: 600,
    });

    window.closeDrawingTool = () => {
      document.getElementById("imageEditorPopup").style.display = "none";
    };

    window.insertDrawingAndClose = async () => {
      try {
        const dataUrl = window.imageEditor.toDataURL();
        const blob = await fetch(dataUrl).then((res) => res.blob());
        const fileName = `drawing-${Date.now()}.png`;

        const presignedResponse = await axios.post(
          "https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/upload",
          { fileName, fileType: "image/png" }
        );

        const { signedUrl, key } = presignedResponse.data.data;

        await axios.put(signedUrl, blob, {
          headers: { "Content-Type": "image/png" },
        });

        const imageUrl = `https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/${key}`;

        if (editorInstanceRef.current.isMarkdownMode()) {
          editorInstanceRef.current.insertText(`![drawing](${imageUrl})`);
        } else {
          editorInstanceRef.current.exec("addImage", {
            imageUrl,
            altText: "drawing",
          });
        }

        window.closeDrawingTool();
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    };

    // Drawing Tool 커맨드 추가
    editor.addCommand("markdown", "drawingTool", () => {
      document.getElementById("imageEditorPopup").style.display = "block";
      window.imageEditor.loadImageFromURL(
        window.createWhiteCanvas(1000, 600),
        "Blank"
      );
    });

    editor.addCommand("wysiwyg", "drawingTool", () => {
      document.getElementById("imageEditorPopup").style.display = "block";
      window.imageEditor.loadImageFromURL(
        window.createWhiteCanvas(1000, 600),
        "Blank"
      );
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      const popup = document.getElementById("imageEditorPopup");
      if (popup) popup.remove();
    };
  }, []);

  const handleImageUpload = async (blob, callback) => {
    try {
      const fileName =
        blob.name || `image-${Date.now()}.${blob.type.split("/")[1]}`;
      const presignedResponse = await axios.post(
        "https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/upload",
        { fileName, fileType: blob.type }
      );

      const { signedUrl, key } = presignedResponse.data.data;
      await axios.put(signedUrl, blob, {
        headers: { "Content-Type": blob.type },
      });

      const imageUrl = `https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/${key}`;
      callback(imageUrl, "image");
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const addCustomCommands = (editor) => {
    // UML 다이어그램 커맨드
    addUMLCommand(editor);
    // 차트 커맨드
    addChartCommand(editor);
  };

  const addUMLCommand = (editor) => {
    const umlTemplate = `$$uml
participant User
participant Browser
participant Server
participant Database

User -> Browser: 로그인 시도
Browser -> Server: POST /login
Server -> Database: 사용자 검증
Database --> Server: 결과 반환
Server --> Browser: 응답
Browser --> User: 결과 표시
$$`;

    editor.addCommand("markdown", "umlDiagram", () => {
      editor.insertText(umlTemplate);
    });

    editor.addCommand("wysiwyg", "umlDiagram", () => {
      editor.setMarkdown(editor.getMarkdown() + "\n\n" + umlTemplate);
    });
  };

  const addChartCommand = (editor) => {
    const chartTemplate = `$$chart
,Seoul,Sydney,Moskva
Jan,20,5,30
Feb,40,30,5
Mar,25,21,18
Apr,50,18,21
May,15,59,33
Jun,45,50,21
Jul,33,28,29
Aug,34,33,15
Sep,20,21,33
Oct,40,18,21
Nov,75,59,29
Dec,50,50,15

type: area
title: Monthly Satisfaction
x.title: Cities
y.title: Popularity
y.min: 0
y.max: 80
series.spline: true
series.zoomable: true
legend.align: bottom
$$`;

    editor.addCommand("markdown", "insertChart", () => {
      editor.insertText(chartTemplate);
    });

    editor.addCommand("wysiwyg", "insertChart", () => {
      editor.setMarkdown(editor.getMarkdown() + "\n\n" + chartTemplate);
    });
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleCloseD3Editor = () => {
    setShowD3Editor(false);
    setShowOverlay(false);
    if (d3EditorRef.current) {
      d3EditorRef.current = null;
    }
  };

  const handleSubmit = async () => {
    if (!postTitle) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!editorInstanceRef.current.getMarkdown()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const postData = {
        title: postTitle,
        content: editorInstanceRef.current.getMarkdown(),
        category: selectedCategory,
        tags: JSON.stringify(tags),
        author: { id: user.email, name: user.name },
      };

      const response = await axios.post(
        "https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts",
        postData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        alert("게시물이 작성되었습니다.");
        navigate(`/community/post-detail/${response.data.data.id}`);
      }
    } catch (error) {
      console.error("게시물 작성 실패:", error);
      alert("게시물 작성에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-10">
      {" "}
      {/* 배경색도 동일하게 수정 */}
      <div className="max-w-4xl mx-auto px-5">
        {" "}
        {/* 너비를 1200px로 수정 */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="space-y-6">
            {/* 제목 입력 */}
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full text-2xl font-medium px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="제목을 입력하세요"
            />

            {/* 카테고리 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        selectedCategory === category.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 태그 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">태그</label>
              <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  className="w-full px-2 py-1 text-sm focus:outline-none"
                  placeholder="태그를 입력하고 Enter를 누르세요"
                />
              </div>
            </div>

            {/* 에디터 */}
            <div ref={editorRef} className="min-h-[400px]"></div>

            {/* 하단 버튼 */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                게시하기
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* D3 에디터 모달 */}
      {showD3Editor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg w-[700px] d3-editor-container">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded hover:bg-gray-100"
                    id="select-tool"
                  >
                    선택
                  </button>
                  <button
                    className="px-4 py-2 rounded hover:bg-gray-100"
                    id="stamp-tool"
                  >
                    스탬프
                  </button>
                  <button
                    className="px-4 py-2 rounded hover:bg-gray-100"
                    id="pen-tool"
                  >
                    펜
                  </button>
                  <button
                    className="px-4 py-2 rounded hover:bg-gray-100"
                    id="eraser-tool"
                  >
                    지우개
                  </button>
                  <button
                    className="px-4 py-2 rounded hover:bg-gray-100"
                    id="clear-all"
                  >
                    초기화
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    id="save-svg"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCloseD3Editor}
                    className="px-4 py-2 rounded hover:bg-gray-100"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
            <div id="d3-canvas" className="w-full h-[500px] bg-white"></div>
          </div>
        </div>
      )}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleCloseD3Editor}
        />
      )}
    </main>
  );
};

export default BoardEditor;
