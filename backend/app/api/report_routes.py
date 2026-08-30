import logging
from fastapi import APIRouter, HTTPException
from app.core.report_schemas import ReportDraftRequest, ReportDraftResponse
from app.services.report_generator import report_draft_generator

router = APIRouter(prefix="/api", tags=["Reporting Engine"])
logger = logging.getLogger(__name__)


@router.post("/generate-report", response_model=ReportDraftResponse)
async def generate_report(request: ReportDraftRequest) -> ReportDraftResponse:
    """
    Drafts a cybercrime.gov.in-style complaint from an already-completed scan
    result the frontend already has in hand.

    Isolated by design: does not call, import, or modify detect_pipeline,
    analysis_ensemble, or the security/safety-lock package, and never
    contacts cybercrime.gov.in itself — it only produces draft text for the
    user to review and submit manually.
    """
    try:
        scan_data = request.model_dump()
        result = await report_draft_generator.generate(scan_data)
        return ReportDraftResponse(**result)
    except Exception as exc:
        logger.exception("Report draft generation failed")
        raise HTTPException(status_code=500, detail=f"Report draft generation error: {exc}")
