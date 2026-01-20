import enum

class ActiveStage(enum.Enum):
    excavation = "Excavation"
    slab = "Slab"
    brickwork = "Brickwork"
    plumbing = "Plumbing"
    electrical = "Electrical"
    painting = "Painting"
    finishing = "Finishing"
    other = "Other"


class WorkStatus(enum.Enum):
    completed = "Work Completed"
    partial = "Partially Completed"
    no_work = "No Work"


class IssueType(enum.Enum):
    material = "Material"
    equipment = "Equipment"
    water = "Water"
    electricity = "Electricity"
    labour = "Labour"
    weather = "Weather"
    approval = "Approval"
    payment = "Payment"
