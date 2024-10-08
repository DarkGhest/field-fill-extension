let listAttributes =
  "label,p,formcontrolname,type,id,ng-reflect-name,ng-reflect-value,select,input, textarea";
// Este script se ejecuta en el contexto de la página web actual
console.log("Ejecutando extension FIELD-FILL");

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  const datos = request.data;
  switch (request.action) {
    case "llenar-campo-activo": {
      let query = getSelector(document.activeElement);
      sendCharacter(query, datos, "text");
      break;
    }
    case "obtener-query": {
      let query = getSelector(document.activeElement);
      navigator.clipboard
        .writeText(query)
        .then(() => {
          console.log("Texto copiado al portapapeles");
          alert(
            "Se ha pegado en el portapales, acceda a modificar formulario para importar lo copiado"
          );
        })
        .catch((err) => {
          console.error("Error al copiar al portapapeles:", err);
          alert("Error al copiar al portapapeles");
        });
      break;
    }
    case "ejecutarAccion": {
      let anterior = "";
      for (const dato of datos) {
        let value = dato.value;
        if (dato.value == "<anterior>") {
          value = anterior;
        }
        await sendCharacter(dato.query, value, dato.type);
        anterior = dato.value;
      }
      break;
    }
    case "obtener-inputs": {
      chrome.storage.local.get("listAttributes", function (result) {
        let datos = result.listAttributes;
        let search = listAttributes;
        if (datos) {
          console.log("actualizados", listAttributes + "," + datos);
          search = listAttributes + "," + datos;
        }

        // Obtener todos los elementos de tipo input dentro del formulario
        const form = document.querySelector("body");
        const inputs = form.querySelectorAll(search);

        // Recorrer los elementos y obtener el selector de consulta
        const listFields = [];
        inputs.forEach((input) => {
          const selector = generateSelector(input);
          if (selector) {
            console.log(
              `Selector para el input ${input.name}: ${selector.selector}`
            );
            listFields.push({
              name: selector.name
                ? selector.name
                : "campo_" + listFields.length,
              query: selector.selector,
              type: selector.type,
              value: selector.value,
            });
          }
        });
        if (listFields.length > 0) {
          chrome.runtime.sendMessage({ data: JSON.stringify(listFields) });
        } else {
          alert("No se han encontrado campos");
        }
      });

      break;
    }
    case "llenar-campos": {
      // Obtener todos los elementos de tipo input dentro del formulario
      const form = document.querySelector("body");
      const inputs = form.querySelectorAll("input, textarea, select");

      // Recorrer los elementos y obtener el selector de consulta
      const listFields = [];
      inputs.forEach((input) => {
        const selector = generateSelector(input);
        if (selector) {
          console.log(
            `Selector para el input ${input.name}: ${selector.selector}`
          );
          if (selector.type === "select") {
            listFields.push({
              name: selector.name
                ? selector.name
                : "esperar_campo_" + listFields.length,
              query: "",
              type: "sleep",
              value: 750,
            });
          }
          listFields.push({
            name: selector.name ? selector.name : "campo_" + listFields.length,
            query: selector.selector,
            type: selector.type,
            value: selector.value,
          });
        }
      });
      if (listFields.length > 0) {
        for (let index = 0; index < listFields.length; index++) {
          await sendCharacter(dato.query, "campo-" + index, dato.type);
        }
      }
      break;
    }
  }
});
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sendCharacter(id, value, type) {
  try {
    if (type == "sleep") {
      await sleep(Number(value));
      return;
    }
    const element = document.querySelector(id);
    if (type == "select") {
      selectOptionByText(element, value);
      return;
    }
    if (type == "checkbox") {
      if (value == "true" || value == true) {
        if (!element.checked) {
          element.click();
        }
      } else {
        if (element.checked) {
          element.click();
        }
      }
      return;
    }
    if (type == "radio") {
      if (value == "true" || value == true) {
        if (!element.checked) {
          element.click();
        }
      }
      return;
    }
    if (type == "file") {
      console.log(value);
      downloadFile(value, element);
      return;
    }
    if (type == "date") {
      element.value = "";
      element.value = value;
      element.dispatchEvent(new InputEvent("input", { bubbles: true }));
      return;
    }
    if (type == "click") {
      element.click();
      return;
    }
    if (element) {
      // Borrar contenido existente
      element.value = "";

      // Enviar cada carácter del valor utilizando sendCharacter
      for (var i = 0; i < value.length; i++) {
        element.value += value[i];
        element.dispatchEvent(new InputEvent("input", { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent("keydown", { key: value[i] }));
        element.dispatchEvent(new KeyboardEvent("keypress", { key: value[i] }));
        element.dispatchEvent(new KeyboardEvent("keyup", { key: value[i] }));
        element.dispatchEvent(new InputEvent("input", { bubbles: true }));
      }
      element.dispatchEvent(new Event("blur", { bubbles: true }));
      console.log(element.value);
    }
  } catch (error) {
    console.error(error);
  }
}
// Función para generar el selector de consulta
function generateSelector(element) {
  let name = "";
  let type = "text";
  let value = "";
  let disabled = false;
  if (element.value) {
    value = element.value;
  }
  // verifica si esta desactivado
  Array.from(element.attributes).forEach((attribute) => {
    if (
      attribute.name.includes("disabled") ||
      attribute.name.includes("readonly")
    ) {
      disabled = true;
    }
  });
  {
    // Obtener el elemento padre del input
    const container = element.parentElement;
    if (container) {
      // Obtener el texto del label
      name = container.textContent;
    }
    // Buscar el elemento label dentro del contenedor
    const label = container.querySelector("label");
    if (label) {
      // Obtener el texto del label
      name = label.textContent;
    }
    if (!name) {
      const p = container.querySelector("p");
      if (p) {
        // Obtener el texto del label
        name = p.textContent;
      }
    }
  }
  // busca type
  Array.from(element.attributes).forEach((attribute) => {
    if (attribute.name.includes("type") && attribute.value) {
      switch (attribute.value) {
        case "radio":
          type = "radio";
          if (element.checked) {
            value = true;
          } else {
            value = false;
          }
          break;
        case "checkbox":
          type = "checkbox";
          if (element.checked) {
            value = true;
          } else {
            value = false;
          }
          break;
        case "file":
          type = "file";
          break;
        case "date":
          type = "date";
          break;
        default:
          type = "text";
      }
    }
  });

  // verifica si es un select
  if (element.tagName.toLowerCase() == "select") {
    type = "select";
  }
  // busca su nombre
  if (!name) {
    if (element.id) {
      name = element.id;
    }
    Array.from(element.attributes).forEach((attribute) => {
      if (attribute.name.includes("name") && attribute.value) {
        name = attribute.value;
      }
    });
  }
  if (disabled) {
    return null;
  }
  return {
    selector: getSelector(element),
    name: name,
    type: type,
    value: value,
  };
}
function getAtributes(element) {
  return Array.from(element.attributes).map((attr) => attr.name);
}

async function selectOptionByText(selectElement, searchText) {
  await sleep(1000);
  selectElement.click();
  selectElement.dispatchEvent(new Event("click"));
  selectElement.dispatchEvent(new Event("mousedown"));
  await sleep(500);
  const blurEvent2 = new Event("blur", { bubbles: true });
  selectElement.dispatchEvent(blurEvent2);
  const options = selectElement.options;
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option.text.toLowerCase() === searchText.toLowerCase()) {
      option.selected = true;
      option.dispatchEvent(new Event("mousedown"));
      // Simular evento de cambio
      option.dispatchEvent(new Event("change"));

      const blurEvent = new Event("blur", { bubbles: true });
      option.dispatchEvent(blurEvent);
      // Dispatch events related to selection
      const inputEvent = new Event("input", { bubbles: true });
      option.dispatchEvent(inputEvent);

      break;
    }
  }
  // Simular evento de cambio
  selectElement.dispatchEvent(new Event("change"));

  // Dispatch events related to selection
  const inputEvent = new Event("input", { bubbles: true });
  selectElement.dispatchEvent(inputEvent);

  const blurEvent = new Event("blur", { bubbles: true });
  selectElement.dispatchEvent(blurEvent);
}
function getSelector(element) {
  if (!(element instanceof Element)) return;

  const path = [];
  while (element.nodeType === Node.ELEMENT_NODE) {
    let selector = element.nodeName.toLowerCase();
    {
      let parent = element.parentNode;
      let siblings = Array.from(parent.children);
      let index = siblings.indexOf(element) + 1;

      selector += `:nth-child(${index})`;
    }

    path.unshift(selector);
    element = element.parentNode;
  }

  return path.join(" > ");
}
async function downloadFile(rawData, element) {
  const data = JSON.parse(rawData);
  console.log(data);
  fetch(`http://198.58.97.35:3500/uploader-file/${data.id}`)
    .then((response) => {
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error("Red error: " + response.status);
      }
      return response.blob(); // Convertir la respuesta a un Blob
    })
    .then((blob) => {
      // Crear una URL para el Blob
      const file = new File([blob], data.originalName, { type: blob.type });
      setTimeout(() => {
        const fileInput = element;
        if (fileInput) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
        }
      }, 200);
    })
    .catch((error) => {
      console.error("Error:", error); // Manejar errores
    });
}
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
