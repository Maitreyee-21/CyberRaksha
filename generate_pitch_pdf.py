import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (on pages after page 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "CyberRaksha — Feature Walkthrough & Pitch Script (2:40 min)")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 30, footer_text)
        self.drawString(54, 30, "Confidential & Demo Material — CyberRaksha AI Team")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 42, letter[0] - 54, 42)
        
        self.restoreState()

def generate_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=50,
        bottomMargin=50,
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4,
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0284C7"),
        spaceAfter=12,
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=10,
        spaceAfter=6,
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#1E293B"),
    )
    
    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#FFFFFF"),
    )
    
    table_label = ParagraphStyle(
        'TableLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#334155"),
    )
    
    table_value = ParagraphStyle(
        'TableValue',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#0F172A"),
    )
    
    quote_style = ParagraphStyle(
        'QuoteStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#0F172A"),
    )
    
    story = []
    
    # Title Block
    story.append(Paragraph("CyberRaksha: End-to-End Feature Script", title_style))
    story.append(Paragraph("AI-Powered Cybersecurity Awareness & Emergency Protection | <b>Exact 2m 40s (160s) Walkthrough</b>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284C7"), spaceBefore=0, spaceAfter=10))
    
    # Summary Table
    meta_data = [
        [
            Paragraph("<b>Target Duration:</b>", table_label),
            Paragraph("2 Minutes 40 Seconds (160 seconds)", table_value),
            Paragraph("<b>Pacing:</b>", table_label),
            Paragraph("~135 words / min (~365 words total)", table_value),
        ],
        [
            Paragraph("<b>Core AI Engine:</b>", table_label),
            Paragraph("IBM Granite 4.1-8B Instruct + Guardian", table_value),
            Paragraph("<b>Coverage:</b>", table_label),
            Paragraph("Home, Scanner, DNA, Lock, Report, Tips, History", table_value),
        ],
    ]
    meta_table = Table(meta_data, colWidths=[1.3*inch, 2.2*inch, 1.1*inch, 2.4*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))
    
    # Scenes Data
    scenes = [
        {
            "num": "Scene 1",
            "time": "0:00 - 0:25",
            "duration": "25 sec",
            "title": "Introduction & Inclusive Landing Experience",
            "route": "/",
            "features": "Landing overview, 22 official Indian languages switcher, text-to-speech accessibility, guest onboarding.",
            "action": "Open home page. Highlight the clean shield branding, switch language to Hindi or Marathi, and toggle the 'Listen (Read Aloud)' audio button.",
            "script": "Every single day, millions of citizens receive deceptive digital traps—fake electricity bill disconnections, urgent KYC deactivations, and lottery links. Welcome to CyberRaksha, an intelligent cybersecurity defense companion designed for every citizen. Right from the home page, it provides seamless protection in 22 official Indian languages with read-aloud voice support, ensuring safety has no literacy or language barrier.",
        },
        {
            "num": "Scene 2",
            "time": "0:25 - 0:55",
            "duration": "30 sec",
            "title": "Unified Multi-Modal Threat Scanner",
            "route": "/scan",
            "features": "5-channel ingestion: Text, URL, QR Code, Screenshot/Image (OCR), and Documents. Hybrid AI + regex heuristic engine.",
            "action": "Navigate to Scanner. Click through the 5 input tabs. Drop a fake bank KYC SMS screenshot, showing automatic OCR text extraction in action.",
            "script": "Next is our Unified Scanner. Instead of wondering whether a message is safe, users can test suspicious items across five channels: plain text messages, web links, payment QR codes, document attachments, or image screenshots. Powered by automated OCR and our dual-layer engine—combining IBM Granite AI with deterministic heuristic models—CyberRaksha analyzes the threat within seconds.",
        },
        {
            "num": "Scene 3",
            "time": "0:55 - 1:25",
            "duration": "30 sec",
            "title": "Deep Analysis & Scam DNA Radar",
            "route": "/scan (Results)",
            "features": "Visual Risk Meter, 5-dimensional Scam DNA Radar chart, confidence scores, plain-language red flags.",
            "action": "Display the results panel. Point out the animated Risk Meter indicating High Risk, then hover over the interactive 5-axis Scam DNA radar chart.",
            "script": "The result is instant and transparent. A dynamic Risk Meter immediately reveals the severity score. But CyberRaksha goes further by explaining why it's dangerous through our signature Scam DNA Radar. It graphs five psychological coercion tactics: Urgency, Fear, Impersonation, Suspicious Links, and Payment Pressure. Users instantly understand how the scammer is trying to manipulate them.",
        },
        {
            "num": "Scene 4",
            "time": "1:25 - 1:50",
            "duration": "25 sec",
            "title": "Deterministic Safety Lock & UPI Shield",
            "route": "/safety-lock",
            "features": "Automated URL quarantine, punycode and entropy inspection, UPI reverse-payment detection, blocked links ledger.",
            "action": "Switch to the Safety Lock tab. Show a quarantined link blocked by the policy, and display the reverse-payment UPI PIN warning.",
            "script": "Awareness alone isn't enough; active defense is vital. That's why CyberRaksha incorporates a Deterministic Safety Lock. While AI evaluates context, our strict security engine automatically quarantines dangerous URLs, catches deceptive punycode domains, and halts fraudulent UPI requests. It stops common 'Enter PIN to receive prize' traps before financial damage occurs.",
        },
        {
            "num": "Scene 5",
            "time": "1:50 - 2:15",
            "duration": "25 sec",
            "title": "Emergency Response & Cybercrime Report Drafter",
            "route": "/report",
            "features": "1-click 1930 National Helpline dialer, immediate bank freeze checklist, automated cybercrime.gov.in complaint synthesizer.",
            "action": "Open the Report page. Highlight the big 1930 helpline dial button, then show the auto-drafted formal complaint text with one-click copy.",
            "script": "If a user has already been targeted, CyberRaksha turns into an emergency response hub. With one touch, victims can dial India's National Cyber Crime Helpline at 1930 or follow bank-freeze guidelines. Even better, it synthesizes the scan evidence, timestamps, and suspect details into a structured formal complaint ready to copy directly into cybercrime.gov.in.",
        },
        {
            "num": "Scene 6",
            "time": "2:15 - 2:40",
            "duration": "25 sec",
            "title": "Safety Tips, Scan History & Granular Settings",
            "route": "/safety-tips, /history, /settings",
            "features": "Educational prevention cards, searchable personal scan history, font-size adjustment, dark/light themes, secure local storage.",
            "action": "Quickly showcase the categorized Safety Tips cards (OTP, KYC, UPI), glance at the searchable History log, and end on the CyberRaksha logo.",
            "script": "Finally, users can explore regional Safety Tips on OTP and job frauds, search their private Scan History ledger, and customize themes and font sizes in Settings. From detection and explanation to prevention and formal reporting, CyberRaksha empowers every digital citizen with proactive, multi-layered cyber defense. Simple, intelligent, and secure.",
        },
    ]
    
    for scene in scenes:
        card_content = []
        
        # Header row inside card
        header_table_data = [
            [
                Paragraph(f"<b>{scene['num']} ({scene['time']} • {scene['duration']})</b>", ParagraphStyle(
                    'CardHeaderTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor("#0F172A")
                )),
                Paragraph(f"<b>Route:</b> {scene['route']}", ParagraphStyle(
                    'CardHeaderRoute', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, alignment=2, textColor=colors.HexColor("#0284C7")
                )),
            ]
        ]
        h_table = Table(header_table_data, colWidths=[4.2*inch, 2.6*inch])
        h_table.setStyle(TableStyle([
            ('TOPPADDING', (0, 0), (-1, -1), 2),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        card_content.append(h_table)
        card_content.append(Spacer(1, 4))
        
        # Details
        detail_data = [
            [Paragraph("<b>Screen Cue:</b>", table_label), Paragraph(scene['action'], table_value)],
            [Paragraph("<b>Key Tech:</b>", table_label), Paragraph(scene['features'], table_value)],
            [Paragraph("<b>Spoken Script:</b>", table_label), Paragraph(f"\"{scene['script']}\"", quote_style)],
        ]
        detail_table = Table(detail_data, colWidths=[1.0*inch, 5.8*inch])
        detail_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('LEFTPADDING', (0, 0), (-1, -1), 2),
            ('RIGHTPADDING', (0, 0), (-1, -1), 2),
            ('LINEBELOW', (0, 0), (-1, 0), 0.5, colors.HexColor("#F1F5F9")),
            ('LINEBELOW', (0, 1), (-1, 1), 0.5, colors.HexColor("#F1F5F9")),
        ]))
        card_content.append(detail_table)
        
        # Outer Card Table
        outer_card = Table([[card_content]], colWidths=[7.0*inch])
        outer_card.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FFFFFF")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(KeepTogether([outer_card, Spacer(1, 8)]))
        
    # Presenter Checklist
    story.append(Spacer(1, 6))
    checklist_title = Paragraph("<b>Presenter Delivery Tips & Timing Sync</b>", section_heading)
    checklist_text = Paragraph(
        "• <b>Sync Clicks to Section Start:</b> Trigger page transitions right as you speak the first sentence of each scene.<br/>"
        "• <b>Keywords to Punch:</b> Emphasize <i>IBM Granite AI</i>, <i>Scam DNA Radar</i>, <i>Deterministic Safety Lock</i>, and <i>1930 Helpline</i>.<br/>"
        "• <b>Pacing Check:</b> If running fast, pause for 1 second after 'Scam DNA Radar' and 'Deterministic Safety Lock' to let visuals register.",
        body_style
    )
    story.append(KeepTogether([
        checklist_title,
        Table([[checklist_text]], colWidths=[7.0*inch], style=[
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ])
    ]))
    
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == "__main__":
    output_pdf = r"c:\Users\maitr\CyberRaksha\CyberRaksha_Walkthrough_Script_2m40s.pdf"
    generate_pdf(output_pdf)
    print(f"Successfully generated: {output_pdf}")
