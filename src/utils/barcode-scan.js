import { BrowserPDF417Reader } from '@zxing/browser';

const readImageFile = async (file) => {
  const returnedImage = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target.result;
      image.onload = () => resolve(image);
    };
    reader.readAsDataURL(file);
  });
  return returnedImage;
};

const decodeBarcode = async (image) => {
  try {
    const codeReader = new BrowserPDF417Reader();
    const result = await codeReader.decodeFromImageElement(image);
    return result.text;
  } catch (error) {
    return new Error('Error :', error);
  }
};

const csvToJson = (csvData) => {
  const rows = csvData.split('\n');

  // TODO: Clean up this logic later...
  const keys = [];
  const values = [];
  const finalArr = [];
  rows.forEach((row) => {
    keys.push(row.substring(0, 3));
    values.push(row.substring(3, row.length));
  });

  rows.forEach((row, i) => {
    const obj = {};
    obj[`${keys[i]}`] = `${values[i]}`;
    finalArr.push(obj);
  });
  return finalArr;
};

const getDriversLicenseData = async (file) => {
  const image = await readImageFile(file);
  const decoded = await decodeBarcode(image);
  let returnedData = '';
  if (decoded) {
    const jsonData = csvToJson(decoded);
    returnedData = JSON.stringify(jsonData, null, 2);
  } else {
    returnedData = new Error('Unable to decode file');
  }
  return returnedData;
};

export default getDriversLicenseData;
