export class D3Editor {
  constructor(editorInstance, closeModal) {
    this.editor = editorInstance;
    this.closeModal = closeModal;
    this.currentTool = null;
    this.svg = null;
    this.mainLayer = null;
    this.stampsContainer = null;
    this.selectedStamp = null;
    this.isDrawing = false;
    this.penWidth = 4;
    this.currentModal = null;
    this.selectedElements = new Set();
    this.selectionRect = null;
    this.selectionStart = null;

    // 기본 제공 스탬프
    this.stamps = [
      "https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/stamp/firefox.svg",
      "https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/stamp/linux.svg",
      "https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/stamp/redhat.svg",
      "https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/stamp/ubuntu.svg",
      "https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/stamp/apiGateway.svg",
      "https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/stamp/lambda.svg",
      "https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/stamp/dynamoDB.svg",
      "https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/stamp/arrow.svg",
    ];

    this.initCanvas();
    this.initEvents();
  }

  initCanvas() {
    this.svg = window.d3
      .select("#d3-canvas")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    this.mainLayer = this.svg.append("g").attr("class", "main-layer");

    this.stampsContainer = this.mainLayer
      .append("g")
      .attr("class", "stamps-container");
  }

  initEvents() {
    document.getElementById("stamp-tool").addEventListener("click", () => {
      this.setTool("stamp");
      this.openStampSelect();
    });

    document.getElementById("pen-tool").addEventListener("click", () => {
      this.setTool("pen");
      this.openPenSettings();
      this.initPenTool();
    });

    document.getElementById("eraser-tool").addEventListener("click", () => {
      this.setTool("eraser");
      this.initEraserTool();
    });

    document.getElementById("select-tool").addEventListener("click", () => {
      this.setTool("select");
      this.initSelectTool();
    });

    document.getElementById("clear-all").addEventListener("click", () => {
      if (window.confirm("모든 요소를 삭제하시겠습니까?")) {
        this.clearAll();
      }
    });

    document.getElementById("save-svg").addEventListener("click", () => {
      this.saveSvg();
    });

    // 툴 버튼들의 active 상태 관리
    const toolBtns = document.querySelectorAll(
      "#select-tool, #stamp-tool, #pen-tool, #eraser-tool"
    );

    toolBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        toolBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  async saveSvg() {
    try {
      const originalSvg = this.svg.node();
      const tempSvg = originalSvg.cloneNode(true);

      tempSvg.setAttribute("width", "800");
      tempSvg.setAttribute("height", "600");
      tempSvg.style.cssText = "cursor: default; background-color: white;";

      tempSvg.querySelectorAll(".handle").forEach((handle) => handle.remove());

      const images = tempSvg.querySelectorAll("image");
      for (let img of images) {
        try {
          const response = await fetch(img.getAttribute("href"));
          const blob = await response.blob();

          const reader = new FileReader();
          const base64data = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });

          img.setAttribute("href", base64data);
        } catch (error) {
          console.error("이미지 변환 중 오류:", error);
        }
      }

      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(tempSvg);
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

      const blob = new Blob([source], { type: "image/svg+xml" });
      const fileName = `drawing-${Date.now()}.svg`;

      const presignedResponse = await window.axios.post(
        "https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/upload",
        {
          fileName,
          fileType: "image/svg+xml",
        }
      );

      if (!presignedResponse.data.success) {
        throw new Error("Presigned URL 생성 실패");
      }

      const { signedUrl, key } = presignedResponse.data.data;

      await window.axios.put(signedUrl, blob, {
        headers: {
          "Content-Type": "image/svg+xml",
        },
      });

      const publicUrl = `https://sdj-upload-bucket-dev.s3.ap-northeast-2.amazonaws.com/${key}`;

      this.clearAll();

      const currentMode = this.editor.isMarkdownMode();

      if (!currentMode) {
        this.editor.changeMode("markdown");
      }

      this.editor.insertText(`![svg](${publicUrl})`);

      if (!currentMode) {
        this.editor.changeMode("wysiwyg");
      }

      this.closeModal(); // React 상태 업데이트
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  }

  setTool(tool) {
    this.currentTool = tool;
    this.closeCurrentModal();
    this.svg.style("cursor", tool === "stamp" ? "crosshair" : "default");
  }

  closeCurrentModal() {
    const modals = document.querySelectorAll(
      ".stamp-select-modal, .pen-settings-modal"
    );
    modals.forEach((modal) => modal.remove());
    this.currentModal = null;
  }

  openStampSelect() {
    this.closeCurrentModal();
    const modal = document.createElement("div");
    modal.className = "stamp-select-modal";
    modal.innerHTML = `
      <div class="stamp-grid">
        ${this.stamps
          .map(
            (stamp) => `
          <div class="stamp-item">
            <img src="${stamp}" alt="stamp">
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.querySelector(".d3-editor-container").appendChild(modal);
    this.currentModal = modal;

    modal.querySelectorAll(".stamp-item").forEach((item, index) => {
      item.addEventListener("click", () => {
        this.selectedStamp = this.stamps[index];
        modal.remove();
        this.initStampPlacement();
      });
    });
  }

  initStampPlacement() {
    this.svg.on("click", (event) => {
      if (this.currentTool === "stamp" && this.selectedStamp) {
        const [x, y] = window.d3.pointer(event);
        this.placeStamp(x, y);
      }
    });
  }

  placeStamp(x, y) {
    const stamp = this.stampsContainer
      .append("g")
      .attr("class", "stamp")
      .attr("transform", `translate(${x}, ${y})`);

    stamp
      .append("image")
      .attr("href", this.selectedStamp)
      .attr("width", 50)
      .attr("height", 50)
      .attr("x", -25)
      .attr("y", -25);

    stamp
      .append("circle")
      .attr("class", "handle rotate-handle")
      .attr("cx", 0)
      .attr("cy", -40)
      .attr("r", 4);

    stamp
      .append("rect")
      .attr("class", "handle scale-handle")
      .attr("x", 21)
      .attr("y", 21)
      .attr("width", 8)
      .attr("height", 8);

    this.initStampControls(stamp, x, y);
  }

  initStampControls(stamp, initialX, initialY) {
    const transform = {
      x: initialX,
      y: initialY,
      rotate: 0,
      scale: 1,
    };

    const dragMove = window.d3.drag().on("drag", (event) => {
      transform.x += event.dx;
      transform.y += event.dy;
      this.updateStampTransform(stamp, transform);
    });

    const dragRotate = window.d3.drag().on("drag", (event) => {
      const [mouseX, mouseY] = window.d3.pointer(event, this.svg.node());
      const stampCenter = this.getStampCenter(stamp);
      const angle =
        (Math.atan2(mouseY - stampCenter.y, mouseX - stampCenter.x) * 180) /
        Math.PI;
      transform.rotate = angle + 90;
      this.updateStampTransform(stamp, transform);
    });

    const dragScale = window.d3
      .drag()
      .on("start", (event) => {
        event.subject.startScale = transform.scale;
        const [mouseX, mouseY] = window.d3.pointer(event, this.svg.node());
        const stampCenter = this.getStampCenter(stamp);
        event.subject.startDistance = Math.hypot(
          mouseX - stampCenter.x,
          mouseY - stampCenter.y
        );
      })
      .on("drag", (event) => {
        const [mouseX, mouseY] = window.d3.pointer(event, this.svg.node());
        const stampCenter = this.getStampCenter(stamp);
        const currentDistance = Math.hypot(
          mouseX - stampCenter.x,
          mouseY - stampCenter.y
        );

        transform.scale =
          event.subject.startScale *
          (currentDistance / event.subject.startDistance);
        this.updateStampTransform(stamp, transform);
      });

    stamp.call(dragMove);
    stamp.select(".rotate-handle").call(dragRotate);
    stamp.select(".scale-handle").call(dragScale);

    stamp.on("click", function (event) {
      if (event.ctrlKey || event.metaKey) {
        event.stopPropagation();
        window.d3.select(this).remove();
      }
    });
  }

  getStampCenter(stamp) {
    const transform = stamp.attr("transform");
    const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
    };
  }

  updateStampTransform(stamp, transform) {
    stamp.attr(
      "transform",
      `translate(${transform.x}, ${transform.y}) rotate(${transform.rotate}) scale(${transform.scale})`
    );
  }

  openPenSettings() {
    this.closeCurrentModal();
    const modal = document.createElement("div");
    modal.className = "pen-settings-modal";
    modal.innerHTML = `
      <div class="setting-item">
        <label>펜 두께</label>
        <div class="setting-control">
          <input type="range" id="pen-width" min="1" max="10" value="${this.penWidth}" step="1">
          <span id="pen-width-value">${this.penWidth}px</span>
        </div>
      </div>
    `;

    document.querySelector(".d3-editor-container").appendChild(modal);
    this.currentModal = modal;

    const widthSlider = modal.querySelector("#pen-width");
    const widthValue = modal.querySelector("#pen-width-value");

    widthSlider.addEventListener("input", (e) => {
      this.penWidth = parseInt(e.target.value);
      widthValue.textContent = `${this.penWidth}px`;
    });
  }

  initPenTool() {
    let isDrawing = false;
    let currentPath = null;
    let points = [];

    this.svg
      .on("mousedown", (event) => {
        if (this.currentTool !== "pen") return;
        isDrawing = true;
        const [x, y] = window.d3.pointer(event);
        points = [[x, y]];
        currentPath = this.mainLayer
          .append("path")
          .attr("class", "pen-path")
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-width", this.penWidth)
          .attr("d", window.d3.line()(points));
      })
      .on("mousemove", (event) => {
        if (!isDrawing || this.currentTool !== "pen") return;
        const [x, y] = window.d3.pointer(event);
        points.push([x, y]);
        currentPath.attr(
          "d",
          window.d3.line().curve(window.d3.curveBasis)(points)
        );
      })
      .on("mouseup", () => {
        isDrawing = false;
      })
      .on("mouseleave", () => {
        isDrawing = false;
      });
  }

  initEraserTool() {
    const eraserSize = 20;

    let eraserCursor = this.svg.select(".eraser-cursor");
    if (eraserCursor.empty()) {
      eraserCursor = this.svg
        .append("circle")
        .attr("class", "eraser-cursor")
        .attr("r", eraserSize / 2)
        .style("display", "none");
    }

    this.svg
      .on("mousemove", (event) => {
        if (this.currentTool !== "eraser") {
          eraserCursor.style("display", "none");
          return;
        }

        const [x, y] = window.d3.pointer(event);
        eraserCursor.attr("cx", x).attr("cy", y).style("display", "block");

        if (event.buttons === 1) {
          this.mainLayer.selectAll("path.pen-path").each(function () {
            const path = window.d3.select(this);
            const pathNode = this;
            const bounds = pathNode.getBBox();
            if (
              x >= bounds.x &&
              x <= bounds.x + bounds.width &&
              y >= bounds.y &&
              y <= bounds.y + bounds.height
            ) {
              path.remove();
            }
          });
        }
      })
      .on("mouseleave", () => {
        eraserCursor.style("display", "none");
      });
  }

  initSelectTool() {
    this.svg
      .on("mousedown.select", null)
      .on("mousemove.select", null)
      .on("mouseup.select", null)
      .on("click.select", null);

    this.svg.on("mousedown.select", (event) => {
      if (this.currentTool !== "select") return;
      if (event.target !== this.svg.node()) return;

      if (!event.shiftKey) {
        this.clearSelection();
      }

      const [x, y] = window.d3.pointer(event);
      this.selectionStart = [x, y];

      this.selectionRect = this.svg
        .append("rect")
        .attr("class", "selection-rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", 0)
        .attr("height", 0)
        .attr("fill", "rgba(0, 123, 255, 0.1)")
        .attr("stroke", "#007bff")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4");
    });

    this.svg.on("mousemove.select", (event) => {
      if (!this.selectionRect || this.currentTool !== "select") return;

      const [currentX, currentY] = window.d3.pointer(event);
      const [startX, startY] = this.selectionStart;

      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      this.selectionRect
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height);
    });

    // 선택 완료 (mouseup 이벤트)
    this.svg.on("mouseup.select", () => {
      if (!this.selectionRect || this.currentTool !== "select") return;

      const bounds = this.selectionRect.node().getBBox();

      this.mainLayer.selectAll(".stamp, .pen-path").each((d, i, nodes) => {
        const el = nodes[i];
        const elBounds = el.getBBox();
        const elTransform = el.getAttribute("transform");
        let tx = 0,
          ty = 0;

        if (elTransform) {
          const match = elTransform.match(/translate\(([^,]+),([^)]+)\)/);
          if (match) {
            tx = parseFloat(match[1]);
            ty = parseFloat(match[2]);
          }
        }

        const adjustedBounds = {
          x: elBounds.x + tx,
          y: elBounds.y + ty,
          width: elBounds.width,
          height: elBounds.height,
        };

        if (this.boundsIntersect(bounds, adjustedBounds)) {
          this.selectedElements.add(el);
          window.d3.select(el).classed("selected", true);
        }
      });

      this.selectionRect.remove();
      this.selectionRect = null;
      this.selectionStart = null;
      this.updateGroupBounds();
    });

    // 선택된 요소 드래그 이벤트
    const dragElements = window.d3.drag().on("drag", (event) => {
      if (this.currentTool !== "select") return;

      this.selectedElements.forEach((el) => {
        const currentTransform = el.getAttribute("transform") || "";
        const translate = currentTransform.match(
          /translate\(([^,]+),([^)]+)\)/
        );
        const x = translate ? parseFloat(translate[1]) : 0;
        const y = translate ? parseFloat(translate[2]) : 0;

        const newX = x + event.dx;
        const newY = y + event.dy;

        let newTransform = currentTransform;
        if (translate) {
          newTransform = currentTransform.replace(
            /translate\([^)]*\)/,
            `translate(${newX}, ${newY})`
          );
        } else {
          newTransform = `translate(${newX}, ${newY}) ${currentTransform}`;
        }

        el.setAttribute("transform", newTransform);
      });
      this.updateGroupBounds();
    });

    // 스탬프와 펜 패스에 드래그 이벤트 적용
    this.mainLayer
      .selectAll(".stamp, .pen-path")
      .on("mousedown", (event) => {
        if (this.currentTool !== "select") return;

        const target = event.currentTarget;
        if (!target.classList.contains("selected")) {
          if (!event.shiftKey) {
            this.clearSelection();
          }
          this.selectedElements.add(target);
          window.d3.select(target).classed("selected", true);
        }
      })
      .call(dragElements);

    // Delete 키로 선택된 요소들 삭제
    document.addEventListener("keydown", (event) => {
      if (event.key === "Delete" && this.currentTool === "select") {
        this.selectedElements.forEach((el) => {
          window.d3.select(el).remove();
        });
        this.selectedElements.clear();
      }
    });
  }

  clearSelection() {
    this.selectedElements.forEach((el) => {
      window.d3.select(el).classed("selected", false);
    });
    this.selectedElements.clear();
  }

  boundsIntersect(b1, b2) {
    return !(
      b2.x > b1.x + b1.width ||
      b2.x + b2.width < b1.x ||
      b2.y > b1.y + b1.height ||
      b2.y + b2.height < b1.y
    );
  }

  updateGroupBounds() {
    this.svg.selectAll(".group-bounds").remove();

    if (this.selectedElements.size > 0) {
      let minX = Infinity,
        minY = Infinity;
      let maxX = -Infinity,
        maxY = -Infinity;

      this.selectedElements.forEach((el) => {
        const bounds = el.getBBox();
        const transform = el.getAttribute("transform");
        let tx = 0,
          ty = 0;
        let scale = 1;

        if (transform) {
          const translateMatch = transform.match(
            /translate\(([^,]+),([^)]+)\)/
          );
          if (translateMatch) {
            tx = parseFloat(translateMatch[1]);
            ty = parseFloat(translateMatch[2]);
          }

          const scaleMatch = transform.match(/scale\(([^)]+)\)/);
          if (scaleMatch) {
            scale = parseFloat(scaleMatch[1]);
          }
        }

        minX = Math.min(minX, bounds.x * scale + tx);
        minY = Math.min(minY, bounds.y * scale + ty);
        maxX = Math.max(maxX, (bounds.x + bounds.width) * scale + tx);
        maxY = Math.max(maxY, (bounds.y + bounds.height) * scale + ty);
      });

      const padding = 12;

      this.svg
        .append("rect")
        .attr("class", "group-bounds")
        .attr("x", minX - padding)
        .attr("y", minY - padding)
        .attr("width", maxX - minX + padding * 2)
        .attr("height", maxY - minY + padding * 2);
    }
  }

  clearAll() {
    this.mainLayer.selectAll(".stamp, .pen-path").remove();
    this.selectedElements.clear();
    this.svg.selectAll(".group-bounds").remove();
  }
}
