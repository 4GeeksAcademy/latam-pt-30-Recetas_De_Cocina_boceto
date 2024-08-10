from urllib import response
import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from fpdf import FPDF
from PIL import Image
import requests
from io import BytesIO


load_dotenv(find_dotenv(), override=True)
client = OpenAI
def generate_recipe(ingredientes):
    system_prompt  = '''
        Eres un chef de primera clase
        '''
    user_prompt  = f'''
        Crea una receta detallada basada unicamente en los siguientes ingredientes { ', '.join(ingredientes)}
        Por Favor formatea la receta de la siguiente manera :

        Titulo de la receta:

        Ingredientes de la receta con tamaño y porción:

        Lista de instrucciones para esta receta:
        '''
    response = client.chat.completions.create(
        model='gpt-4o',
        messages=[
            { 'role': 'system', 'content': system_prompt},
            { 'role': 'user', 'content': user_prompt}
        ],
        max_tokens=1020,
        temperature=0.9
    )
    return response.choices[0].message.content

def obtener_nombre_receta(texto):
    lines = texto.splitlines()

    return lines[1]

def generar_imagen(titulo_receta):
    prompt  = f'''
    Crea una imagen fotorrealista del plano final titulado "{titulo_receta}".
    El plato debe de estar bellamente representado en un plato de ceramica con un enfoque cercano en las 
    texturas y colores de los ingredientes.
    La ambientación debe de ser una sobremesa de madera con iluminación natural para resaltar las 
    caracteristicas apetitosas de la comida. Asegurate de que la imagen capture los colores ricos
    y vibrantes y los detalles intrincados de la comida, haciendola parcer recien preparada y lista
    para comer. 
    '''
    response = client.images.generate(
        model='dall-e-3',
        prompt=prompt,
        style='vivid',
        size='1024x1024',
        quality='standard',
        n=1

    )
    return response.data[0].url

def save_to_pdf(titulo_receta, receta, imagen_url):
    pdf= FPDF()
    pdf.add_page()
    pdf.set_font(family="Arial", size=12)

    pdf.set_font(family="Arial",style='B', size=16)
    pdf.cell(w=0, h=10, txt=titulo_receta, ln=True, align='C')

    response = requests.get(imagen_url)
    img = Image.open(BytesIO(response.content)).convert("RGB")
    img_path = f"{titulo_receta.replace(' ', '_')}.jpg"
    img.save(img_path, format="JPEG")

    pdf.ln(10)
    img_width = 190
    pdf.image(img_path, x=(pdf.w - img_width) / 2, w=img_width, type='JPEG')
    pdf.ln(10)

    pdf.set_font(family="Arial", size=12)
    for line in receta.split('/n'):
        pdf.multi_cell(line, w=0, h=10,)

        pdf_file = "receta.pdf"
        pdf.output(pdf_file)

        return pdf_file
    
    st.title("Generador de Recetas")
    st.write("Ingrese los ingredientes para generar una receta personalizada:")
    ingredientes  = st.text_input("ingredientes(separados por comas)")

    if st.button("Generar receta"):
        ingredientes_list = [ing.strip() for ing in ingredientes.split(",")]
        receta = generate_recipe(ingredientes_list)
        st.session_state.receta = receta
        titulo_receta  = obtener_nombre_receta(receta)
        st.session_state.titulo_receta = titulo_receta
        imagen_receta  = generar_imagen(titulo_receta)
        st.session_state.imagen_receta = imagen_receta 

    if 'receta' in st.session_state:
        st.write(st.session_state.receta)
        st.write(f"{st.session_state.titulo_receta}")
        st.image(st.session_state.imagen_receta, caption=st.session_state.titulo_receta)

    if st.button("Descargar receta en pdf"):
        pdf_file = save_to_pdf(st.session_state.titulo_receta,
                               st.session_state.receta,
                               st.session_state.imagen_receta)  
        with open(pdf_file,"rb") as f:
            st.download_button(label="Descargar PDF",
                               data=f, file_name=pdf_file,
                               mime="aplication/pdf")
