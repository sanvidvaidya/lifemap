"""Free Streamlit Community Cloud shell for the LifeMap web app.

LifeMap is a client-side React application, so this entrypoint keeps the
experience intact by framing the public static build. Set LIFEMAP_URL to a
GitHub Pages URL after Pages is enabled, or leave the default while the
existing public build is the canonical host.
"""

import os
from urllib.parse import urlparse

import streamlit as st
import streamlit.components.v1 as components


DEFAULT_LIFEMAP_URL = (
    "https://sanvidvaidya.github.io/lifemap/"
)


def public_url() -> str:
    candidate = os.environ.get("LIFEMAP_URL", DEFAULT_LIFEMAP_URL).strip()
    parsed = urlparse(candidate)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("LIFEMAP_URL must be a complete http(s) URL")
    return candidate


st.set_page_config(
    page_title="LifeMap",
    page_icon="public/icon-192.png",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
      #MainMenu, footer, header { visibility: hidden; }
      [data-testid="stAppViewContainer"] { background: #08191b; }
      [data-testid="stMainBlockContainer"] {
        padding: 0 !important;
        max-width: none !important;
      }
      iframe { display: block; border: 0; }
    </style>
    """,
    unsafe_allow_html=True,
)

try:
    lifemap_url = public_url()
except ValueError as error:
    st.error(str(error))
    st.stop()

st.markdown(
    f'<a href="{lifemap_url}" target="_blank" rel="noreferrer">Open LifeMap in a standalone tab</a>',
    unsafe_allow_html=True,
)
components.iframe(lifemap_url, height=1000, scrolling=False)
