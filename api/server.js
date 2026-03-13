import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { google } from "googleapis";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

/* ================= GOOGLE DRIVE ================= */

const auth = new google.auth.GoogleAuth({
  keyFile: "credencial-drive.json",
  scopes: ["https://www.googleapis.com/auth/drive"]
});

const drive = google.drive({
  version: "v3",
  auth
});

/* ================= CONFIG ================= */

const PASTA_RAIZ = "11-0zQrfezeL5NprDx74m_UnvPSS2AsUh";

/* ================= FUNÇÃO CRIAR / BUSCAR PASTA ================= */

async function obterOuCriarPasta(nomeEmpresa){

  const resposta = await drive.files.list({
    q: `'${PASTA_RAIZ}' in parents and name='${nomeEmpresa}' and mimeType='application/vnd.google-apps.folder'`,
    fields: "files(id,name)"
  });

  if(resposta.data.files.length > 0){
    return resposta.data.files[0].id;
  }

  const pasta = await drive.files.create({
    requestBody:{
      name:nomeEmpresa,
      mimeType:"application/vnd.google-apps.folder",
      parents:[PASTA_RAIZ]
    }
  });

  return pasta.data.id;
}

/* ================= UPLOAD ================= */

app.post("/upload-pdf", upload.single("pdf"), async (req,res)=>{

  try{

    const empresa = req.body.empresa || "cliente";

    const pastaEmpresa = await obterOuCriarPasta(empresa);

    const caminho = req.file.path;

    const media = {
      mimeType:"application/pdf",
      body: fs.createReadStream(caminho)
    };

    const hoje = new Date().toISOString().split("T")[0];

    const nomeArquivo = `caderno_${empresa}_${hoje}.pdf`;

    const file = await drive.files.create({
      requestBody:{
        name:nomeArquivo,
        parents:[pastaEmpresa]
      },
      media
    });

    fs.unlinkSync(caminho);

    res.json({
      ok:true,
      fileId:file.data.id
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      ok:false,
      erro:"Falha ao enviar para o Drive"
    });

  }

});

/* ================= START ================= */

const PORT = 3000;

app.listen(PORT,()=>{
  console.log("API rodando na porta",PORT);
});
