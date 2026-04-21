import hashlib

def normalize_name(name):
    """Normalize a name for consistent hashing: strip whitespace and title case."""
    return ' '.join(name.strip().split()).title()

def generate_hash(name, uni, degree, year, certificate_id=None):
    """
    Generates a SHA-256 hash for certificate verification.
    Input: Student Full Name | University | Degree Program | Graduation Year | Certificate ID
    Names are normalized (title case, trimmed) before hashing.
    """
    name = normalize_name(name)
    if certificate_id:
        block_data = f"{name}|{uni}|{degree}|{year}|{certificate_id}"
    else:
        block_data = f"{name}|{uni}|{degree}|{year}"
    return hashlib.sha256(block_data.encode()).hexdigest()