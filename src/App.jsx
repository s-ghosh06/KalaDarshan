
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Palette,
  Globe as GlobeIcon,
  Compass,
  Search,
  MapPin,
  ArrowRight,
  X,
  Bookmark,
  Clock,
  Map as MapIcon,
  BookOpen,
  Landmark,
  RotateCcw,
} from 'lucide-react'
import Globe from 'react-globe.gl'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polygon,
  Tooltip,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

const regions = [
  {
    id: 'kashmir',
    image: '/heritage/kashmir-craft.jpg',
    name: 'Kashmir Valley',
    place: 'Srinagar and the Kashmir Valley',
    position: [34.08, 74.82],
    category: 'Decorative arts',
    period: 'Centuries-old living traditions',
    arts: ['Kashmiri papier-mâché', 'Kashida embroidery', 'Walnut wood carving'],
    history:
      'Kashmir developed a rich craft culture shaped by mountain trade routes, courtly patronage and local artisan communities. Decorative objects, textiles and carved wood became important expressions of regional identity.',
    detail:
      'Look for finely painted papier-mâché objects, intricate needlework and detailed walnut-wood surfaces.',
    influence:
      'Persianate design traditions and local Himalayan craft knowledge',
  },
  {
    id: 'kangra',
    image: '/heritage/kangra-miniature.jpg',
    name: 'Kangra and the Pahari Hills',
    place: 'Kangra Valley, Himachal Pradesh',
    position: [32.1, 76.27],
    category: 'Miniature painting',
    period: 'Especially the 18th century',
    arts: ['Kangra miniature painting', 'Pahari painting', 'Ragamala paintings'],
    history:
      'The Pahari painting traditions grew under the patronage of hill courts. Kangra painting is known for delicate linework, lyrical landscapes and scenes drawn from poetry and devotional literature.',
    detail:
      'Notice the fine faces, flowing landscapes, flowering trees and carefully arranged figures.',
    influence:
      'Hill-court patronage, Vaishnava poetry and regional manuscript traditions',
  },
  {
    id: 'uttarakhand',
    image: '/heritage/aipan-art.jpg',
    name: 'Kumaon and Garhwal',
    place: 'Uttarakhand Himalaya',
    position: [30.32, 79.5],
    category: 'Ritual and folk art',
    period: 'Living traditions',
    arts: ['Aipan ritual designs', 'Garhwali painting traditions', 'Wood carving'],
    history:
      'Art in Kumaon and Garhwal is closely connected with homes, seasonal festivals, worship and community life. Aipan designs use geometric and symbolic patterns in ritual spaces.',
    detail:
      'Explore floor and threshold designs, ritual drawings and the decorative arts of Himalayan settlements.',
    influence:
      'Local ritual practice, Himalayan ecology and household traditions',
  },
  {
    id: 'rajasthan',
    image: '/heritage/mewar-miniature.jpg',
    name: 'Rajasthan and Mewar',
    place: 'Udaipur, Nathdwara and surrounding regions',
    position: [24.6, 73.68],
    category: 'Court and devotional art',
    period: 'Medieval to modern',
    arts: ['Mewar miniature painting', 'Nathdwara Pichwai', 'Phad painting'],
    history:
      'Rajasthan contains several distinct painting traditions. Court workshops produced illustrated manuscripts and miniatures, while devotional paintings and painted scrolls served temple and storytelling settings.',
    detail:
      'Compare detailed court scenes, Pichwai cloth paintings and narrative Phad scrolls.',
    influence:
      'Rajput courts, temple patronage and travelling storytelling communities',
  },
  {
    id: 'gujarat',
    image: '/heritage/ajrakh-textile.jpg',
    name: 'Kutch and Gujarat',
    place: 'Kutch, Saurashtra and Gujarat',
    position: [23.7, 69.8],
    category: 'Textile and craft',
    period: 'Living traditions',
    arts: ['Ajrakh block printing', 'Bandhani tie-dye', 'Rogan painting', 'Embroidery'],
    history:
      'Gujarat’s craft traditions reflect long histories of trade, textile production and exchange across western India and the Indian Ocean. Techniques vary between communities and localities.',
    detail:
      'Discover resist-dyed textiles, repeated block patterns, mirror work and the distinctive painted surface of Rogan art.',
    influence:
      'Textile trade, local artisan lineages and exchange across western India',
  },
  {
    id: 'vidarbha',
    image: '/heritage/vidarbha-textile.jpg',
    name: 'Vidarbha',
    place: 'Eastern Maharashtra',
    position: [20.8, 79.1],
    category: 'Painting and craft',
    period: 'Living traditions',
    arts: ['Folk painting', 'Wood and metal crafts', 'Regional textile traditions'],
    history:
      'Vidarbha is a cultural region of eastern Maharashtra with its own local craft practices, festival traditions and community histories. Its artistic heritage should be understood alongside the wider diversity of Maharashtra.',
    detail:
      'Explore regional craft practices and the cultural links between village life, festivals and artistic expression.',
    influence:
      'Local communities, agricultural life and connections across central India',
  },
  {
    id: 'warli',
    image: '/heritage/warli-art.jpg',
    name: 'Warli Cultural Belt',
    place: 'Palghar and adjoining areas of Maharashtra',
    position: [19.7, 72.8],
    category: 'Community painting',
    period: 'Living tradition',
    arts: ['Warli painting', 'Ritual wall painting', 'Community dance imagery'],
    history:
      'Warli painting is associated with Adivasi communities in the northern Konkan region. Its visual language often uses simple geometric forms to depict people, animals, work, celebrations and ritual life.',
    detail:
      'Look for circles, triangles and lines arranged into scenes of dancing, farming and community gatherings.',
    influence:
      'Community rituals, everyday life and relationships with the natural world',
  },
  {
    id: 'bengal',
    image: '/heritage/bengal-patachitra.jpg',
    name: 'Bengal and the Patachitra Belt',
    place: 'Kolkata, rural Bengal and Pingla',
    position: [22.57, 88.36],
    category: 'Scroll and folk painting',
    period: 'Historic and living traditions',
    arts: ['Kalighat painting', 'Bengal Patachitra', 'Patua scroll storytelling'],
    history:
      'Bengal has diverse painting and storytelling traditions. Kalighat painting developed around nineteenth-century Kolkata, while patua communities in rural Bengal maintain scroll-based visual storytelling practices.',
    detail:
      'Compare the bold brushwork of Kalighat paintings with painted scrolls accompanied by sung narratives.',
    influence:
      'Temple precincts, urban popular culture and travelling storytellers',
  },
  {
    id: 'bastar',
    image: '/heritage/bastar-dhokra.jpg',
    name: 'Bastar and Central India',
    place: 'Bastar region, Chhattisgarh',
    position: [19.1, 81.95],
    category: 'Tribal arts and metalwork',
    period: 'Living traditions',
    arts: ['Dhokra metal casting', 'Gond painting', 'Wood and wrought-iron craft'],
    history:
      'Central India is home to varied Adivasi artistic traditions. Bastar is particularly associated with metalwork and woodcraft, while Gond painting traditions are found across a wider region and among different communities.',
    detail:
      'Explore cast metal figures, ritual objects, painted narratives and the distinct visual practices of local communities.',
    influence:
      'Community knowledge, ritual life, forests and artisan lineages',
  },
  {
    id: 'tulu',
    image: '/heritage/yakshagana.jpg',
    name: 'Tulu Nadu',
    place: 'Coastal Karnataka',
    position: [12.87, 74.88],
    category: 'Ritual performance',
    period: 'Living tradition',
    arts: ['Bhūta Kōlā', 'Yakshagana', 'Temple and ritual arts'],
    history:
      'Tulu Nadu has a distinctive cultural landscape along the Karnataka coast. Bhūta Kōlā is a ritual performance tradition involving costume, music and community worship. Yakshagana is a broader coastal Karnataka performance tradition with elaborate costumes and storytelling.',
    detail:
      'Discover ritual performance, painted and decorated costumes, music, dance and oral narratives.',
    influence:
      'Tulu-speaking communities, coastal temple traditions and performance lineages',
  },
  {
    id: 'tamil',
    image: '/heritage/chola-nataraja.jpg',
    name: 'Tamil Cultural Region',
    place: 'Tamil Nadu and its historic temple centres',
    position: [11.0, 78.2],
    category: 'Temple and classical arts',
    period: 'Ancient to contemporary',
    arts: ['Chola bronze sculpture', 'Tanjore painting', 'Kalamkari traditions'],
    history:
      'Tamil Nadu has a long history of temple architecture, bronze sculpture, painting, music and dance. Chola-period bronzes are celebrated for their craftsmanship, while Tanjore painting is known for devotional subjects and decorative surfaces.',
    detail:
      'Explore bronze casting, temple sculpture, devotional painting and the relationships between art and sacred spaces.',
    influence:
      'Temple institutions, royal patronage and living artistic communities',
  },
  {
    id: 'northeast',
    image: '/heritage/northeast-textile.jpg',
    name: 'Northeast India',
    place: 'Assam and neighbouring northeastern regions',
    position: [26.2, 92.9],
    category: 'Textile and living traditions',
    period: 'Living traditions',
    arts: ['Assamese Sattriya arts', 'Muga silk weaving', 'Regional textiles and masks'],
    history:
      'Northeast India contains many distinct communities and artistic traditions. Assam is known for silk weaving and the arts associated with Vaishnavite satras, while neighbouring regions have their own textile, mask-making and performance traditions.',
    detail:
      'Explore silk weaving, mask-making, manuscript culture and the diverse visual traditions of northeastern communities.',
    influence:
      'River landscapes, community institutions and cross-border cultural exchange',
  },
  {
    id: 'ajanta',
    image: '/heritage/ajanta-murals.jpg',
    name: 'Ajanta and the Deccan',
    place: 'Ajanta caves and the Deccan region',
    position: [20.55, 75.7],
    category: 'Mural painting',
    period: 'Mainly 2nd century BCE–6th century CE',
    arts: ['Ajanta murals', 'Buddhist narrative painting', 'Deccan decorative arts'],
    history:
      'The Ajanta caves preserve major examples of ancient Indian mural painting. Their painted scenes include Buddhist narratives, courtly life, figures, ornament and evidence of sophisticated artistic techniques.',
    detail:
      'Look closely at the painted figures, expressive gestures, layered pigments and narrative scenes preserved in the caves.',
    influence:
      'Buddhist monastic patronage and artistic exchange across the Deccan',
  },
]

const historyDetails = {
  kashmir: {
    timeline: [
      ['Early and medieval networks', 'Kashmir connected Himalayan communities with routes into Central and South Asia; religious, courtly and mercantile exchange shaped its visual culture.'],
      ['Sultanate and Mughal-era exchange', 'Persianate book arts, garden aesthetics and decorative vocabularies influenced local workshops without replacing regional techniques.'],
      ['Living craft lineages', 'Papier-mâché, Kashida embroidery and walnut carving continue through specialist makers, family workshops and contemporary design.'],
    ],
    technique: 'Papier-mâché objects are built from paper pulp or layered paper, shaped, smoothed and painted. Kashida uses carefully planned stitches, while walnut carving depends on the grain and depth of the wood.',
    examples: ['Painted papier-mâché boxes and panels', 'Kashida shawls and embroidered textiles', 'Carved walnut furniture and screens'],
    living: 'Craft workshops, cooperatives and contemporary designers adapt inherited skills for new audiences. Individual styles differ between makers and local workshops.',
  },
  kangra: {
    timeline: [
      ['Seventeenth–eighteenth centuries', 'Pahari painting developed across several Himalayan hill courts, with styles shaped by local rulers, artists and manuscript traditions.'],
      ['Late eighteenth century', 'Kangra painting became especially celebrated for lyrical landscapes, expressive figures and themes from Krishna devotion and poetic literature.'],
      ['Nineteenth century onward', 'Courtly production changed as political patronage shifted; paintings and collections helped preserve the tradition and its visual vocabulary.'],
    ],
    technique: 'Artists used fine brushes and opaque watercolour on paper, building delicate outlines, layered colours, patterned textiles and landscape details.',
    examples: ['Radha–Krishna scenes', 'Ragamala series', 'Poetic and courtly manuscript illustrations'],
    living: 'The style is studied, collected and practised by contemporary artists. Modern works may draw on Pahari conventions without being historical court paintings.',
  },
  uttarakhand: {
    timeline: [
      ['Household and ritual settings', 'Aipan designs have been made for thresholds, floors and ritual spaces, with patterns selected for particular ceremonies and occasions.'],
      ['Community transmission', 'Knowledge has often passed between generations through observation and practice within households and local communities.'],
      ['Contemporary revival', 'Artists and cultural groups now also make Aipan on paper, cloth and objects, expanding its visibility beyond domestic ritual spaces.'],
    ],
    technique: 'Traditional Aipan commonly uses white rice paste on a red ochre ground. Motifs are drawn by hand and can vary with the ritual, locality and maker.',
    examples: ['Ritual floor and threshold designs', 'Geometric and symbolic motifs', 'Contemporary Aipan on portable surfaces'],
    living: 'Aipan remains a living practice, though materials, settings and meanings vary. It should not be reduced to a single fixed pattern or universal symbolism.',
  },
  rajasthan: {
    timeline: [
      ['Early modern court workshops', 'Rajput courts supported distinct painting schools; Mewar developed its own manuscript and courtly visual language.'],
      ['Eighteenth–nineteenth centuries', 'Devotional Pichwai paintings and Phad narrative scrolls served different settings, including temple worship and travelling storytelling.'],
      ['Modern and contemporary practice', 'Artists continue miniature, textile and scroll traditions for ritual, collecting, teaching and contemporary audiences.'],
    ],
    technique: 'Miniatures use fine brushes and layered pigment on paper; Pichwai are painted cloths associated with devotional settings; Phad scrolls organise narrative episodes across a long painted surface.',
    examples: ['Mewar court and manuscript paintings', 'Nathdwara Pichwai cloth paintings', 'Phad scrolls associated with storytelling'],
    living: 'These are related but distinct traditions. Their materials, audiences and ritual roles differ, and contemporary work may adapt older formats.',
  },
  gujarat: {
    timeline: [
      ['Long-distance textile exchange', 'Gujarat’s coastal and inland trading networks helped textiles and dyeing knowledge circulate across western India and the Indian Ocean.'],
      ['Regional workshop traditions', 'Ajrakh, Bandhani, embroidery and Rogan painting developed through specialised skills transmitted among artisan communities.'],
      ['Contemporary craft economies', 'Makers continue traditional work while responding to new markets, design collaborations and changing access to natural and synthetic materials.'],
    ],
    technique: 'Ajrakh uses repeated block printing and resist-dye processes; Bandhani ties tiny sections of cloth before dyeing; Rogan painting applies a thickened pigment to fabric with a stylus-like tool.',
    examples: ['Indigo and madder-toned Ajrakh cloth', 'Bandhani tie-dyed textiles', 'Rogan-painted panels and embroidery'],
    living: 'Technique and design differ across communities and workshops. Look for process details and maker attribution rather than treating all Gujarati textiles as one style.',
  },
  vidarbha: {
    timeline: [
      ['Regional and village practices', 'Vidarbha’s artistic life reflects local festivals, agricultural settings, community craft knowledge and connections across central India.'],
      ['Changing patronage and materials', 'Craft production has responded to household use, local markets and broader shifts in materials and livelihoods.'],
      ['Present-day documentation', 'Regional artists and cultural researchers continue to document varied practices that are not always represented by one famous, uniform art form.'],
    ],
    technique: 'Methods vary by craft and community. Wood, metal, textile and painted objects require different tools and processes; no single technique represents all of Vidarbha.',
    examples: ['Local wood and metal objects', 'Festival and household craft practices', 'Regional textile and decorative traditions'],
    living: 'This entry intentionally treats Vidarbha as a diverse region rather than assigning a single emblematic art to every community. More specific local examples should be added as they are documented.',
  },
  warli: {
    timeline: [
      ['Community wall-painting practice', 'Warli painting is associated with Adivasi communities in the northern Konkan region, especially in present-day Maharashtra.'],
      ['Ritual and everyday imagery', 'Painted scenes have represented community life, human and animal figures, dancing and ritual contexts.'],
      ['Late twentieth century to today', 'Warli artists increasingly worked on paper, canvas and other portable surfaces, bringing the visual language to wider audiences.'],
    ],
    technique: 'Traditional wall paintings often use white rice-based pigment on an earth-toned surface. Circles, triangles and lines build figures and rhythmic scenes.',
    examples: ['Dancing figures and circular formations', 'Scenes of farming and community life', 'Ritual wall paintings and contemporary works'],
    living: 'Warli is a living community tradition. Contemporary artists are individual authors; the style should not be treated as anonymous decoration or detached from its cultural context.',
  },
  bengal: {
    timeline: [
      ['Nineteenth-century Kolkata', 'Kalighat painting developed around the city’s temple precincts and urban popular culture, using a bold, economical visual language.'],
      ['Rural patua traditions', 'In parts of Bengal, scroll painters created sequential images that could be accompanied by sung narratives and performed for audiences.'],
      ['Modern reinterpretations', 'Artists continue scroll painting and related practices, while museums and collectors have shaped how these works are viewed and classified.'],
    ],
    technique: 'Kalighat works are known for fluid brushwork and simplified forms. Patachitra uses sequential painted panels or scrolls; materials and performance practices vary by locality.',
    examples: ['Kalighat paintings', 'Bengal Patachitra scrolls', 'Patua storytelling and song'],
    living: 'Kalighat painting and rural scroll traditions should not be conflated: they have different histories, settings and relationships to performance.',
  },
  bastar: {
    timeline: [
      ['Community metal and woodwork', 'Bastar is known for several Adivasi craft traditions, including metalwork, woodcraft and ritual objects made by specialist artisans.'],
      ['Changing regional markets', 'Craft objects have circulated through local exchange and later through exhibitions, tourism and wider commercial markets.'],
      ['Contemporary practice', 'Makers balance inherited processes with new commissions and changing materials, while community meanings remain important.'],
    ],
    technique: 'Dhokra commonly uses a lost-wax casting process: a wax model is covered with clay, heated so wax drains away, and replaced by molten metal. Local practice and alloys vary.',
    examples: ['Dhokra cast figures and objects', 'Bastar wrought-iron work', 'Gond painting traditions across a wider central Indian region'],
    living: 'Bastar metalwork and Gond painting are not the same tradition, and Gond communities live across a broader area. Captions should identify the particular medium and maker when known.',
  },
  tulu: {
    timeline: [
      ['Coastal ritual landscapes', 'Bhūta Kōlā belongs to ritual settings in Tulu-speaking areas and involves relationships between performers, communities and local spirit traditions.'],
      ['Performance and storytelling', 'Yakshagana developed as a vigorous dance-drama tradition along coastal Karnataka, combining music, elaborate costume and narrative performance.'],
      ['Living performance today', 'Both practices continue, though their purposes and contexts differ: one is a specific ritual practice, the other a theatrical performance tradition.'],
    ],
    technique: 'Yakshagana combines singing, percussion, stylised movement, expressive makeup and elaborate headgear. Bhūta Kōlā costume and ritual sequence vary by locality and tradition.',
    examples: ['Yakshagana characters and stage costumes', 'Bhūta Kōlā ritual adornment', 'Coastal Karnataka music and oral narratives'],
    living: 'Photographs of ritual practice should be contextualised respectfully. Bhūta Kōlā should not be presented simply as entertainment or confused with Yakshagana.',
  },
  tamil: {
    timeline: [
      ['Early historic and medieval temple cultures', 'Tamil regions developed rich temple, sculpture and devotional traditions through changing dynasties, communities and institutions.'],
      ['Chola period, especially c. ninth–thirteenth centuries', 'Chola bronze sculpture became renowned for technically sophisticated casting and images used in religious and ceremonial contexts.'],
      ['Later and modern traditions', 'Tanjore painting and other devotional arts developed through later courtly, temple and workshop settings and remain active in different forms.'],
    ],
    technique: 'Lost-wax casting enables complex bronze forms. Tanjore painting often uses a prepared board, vivid colour and raised decorative details; methods vary between workshops.',
    examples: ['Chola-period bronze images such as Nataraja', 'Tanjore devotional paintings', 'Temple sculpture and associated visual arts'],
    living: 'Historical bronzes and modern replicas are not interchangeable. Date, material, provenance and current religious or museum context matter when describing an object.',
  },
  northeast: {
    timeline: [
      ['Many distinct regional histories', 'Northeast India is not one cultural unit: its communities have distinct languages, textile practices, performance traditions and histories.'],
      ['Assamese institutions and silk traditions', 'Assam is associated with Muga and other silk weaving, as well as arts connected with Vaishnavite satras, including masks and performance.'],
      ['Contemporary makers', 'Weavers and artists across the region continue to adapt techniques and designs while maintaining community-specific identities.'],
    ],
    technique: 'Loom types, fibres, motifs and garment forms differ across communities. Assamese silk traditions are only one part of the Northeast’s broader textile heritage.',
    examples: ['Muga silk weaving in Assam', 'Sattriya performance and satra-associated masks', 'Distinct community-specific handloom traditions'],
    living: 'Avoid presenting Northeast textiles as a single generic style. Where possible, identify the community, garment, technique and place represented by each image.',
  },
  ajanta: {
    timeline: [
      ['Early phase, around the second–first centuries BCE', 'Some Ajanta caves were excavated during an early period of Buddhist patronage, when monastic spaces developed along routes through the Deccan.'],
      ['Later phase, mainly fifth–sixth centuries CE', 'A major phase of excavation and painting produced richly decorated caves supported by patrons and associated with Buddhist monastic life.'],
      ['Rediscovery and conservation', 'Ajanta became widely known to modern scholarship in the nineteenth century; conservation now plays a central role in protecting fragile murals.'],
    ],
    technique: 'Ajanta murals were made on prepared wall surfaces using layered plaster and pigments. Their modelling, gestures, ornament and narrative composition show sophisticated workshop practice.',
    examples: ['Bodhisattva paintings in Cave 1', 'Jataka narrative scenes', 'Painted figures, textiles and courtly details across the caves'],
    living: 'The murals are fragile archaeological heritage. Modern reproductions and photographs help interpretation, but should be distinguished from the original painted surfaces and identified accurately.',
  },
}

// Approximate cultural footprints for visual orientation only; these are not official borders.
const regionShapes = {
  kashmir: [[36.8,73.2],[36.5,76.1],[35.3,77.2],[33.5,76.2],[32.9,74.7],[34.0,73.2],[36.8,73.2]],
  kangra: [[33.5,74.7],[33.5,77.7],[31.5,78.4],[30.8,76.3],[31.5,75.1],[33.5,74.7]],
  uttarakhand: [[31.8,77.3],[31.6,80.4],[29.2,81.1],[28.0,79.4],[29.2,77.5],[31.8,77.3]],
  rajasthan: [[29.0,69.8],[29.7,74.0],[27.0,77.5],[23.0,75.7],[22.8,72.7],[25.2,70.0],[29.0,69.8]],
  gujarat: [[24.8,68.4],[24.5,72.4],[22.4,74.6],[20.0,72.3],[20.3,68.8],[22.4,67.8],[24.8,68.4]],
  vidarbha: [[22.8,76.0],[22.8,81.7],[19.2,82.6],[18.3,79.4],[19.2,76.8],[22.8,76.0]],
  warli: [[21.5,72.0],[21.2,73.8],[18.7,73.8],[18.6,72.2],[20.0,71.8],[21.5,72.0]],
  bengal: [[25.8,85.4],[26.0,89.7],[22.1,89.9],[20.8,87.5],[21.7,85.6],[25.8,85.4]],
  bastar: [[21.7,79.0],[22.0,83.2],[18.0,84.2],[17.0,81.4],[18.4,79.1],[21.7,79.0]],
  tulu: [[15.0,73.8],[14.8,75.0],[11.4,75.1],[11.4,73.8],[13.0,73.5],[15.0,73.8]],
  tamil: [[13.6,76.1],[13.5,80.5],[8.0,79.9],[8.0,76.6],[10.0,76.0],[13.6,76.1]],
  northeast: [[28.2,89.3],[28.7,95.4],[25.2,97.1],[23.7,93.2],[25.1,90.0],[28.2,89.3]],
  ajanta: [[22.7,73.9],[22.7,77.6],[19.1,78.2],[18.5,75.1],[20.0,73.8],[22.7,73.9]],
}

const regionColors = {
  kashmir: '#6689a5', kangra: '#9b83b6', uttarakhand: '#6c9d91',
  rajasthan: '#c18c57', gujarat: '#b66e58', vidarbha: '#b7a45d',
  warli: '#c67e72', bengal: '#8e9e63', bastar: '#9b7958',
  tulu: '#5f9caa', tamil: '#9d7192', northeast: '#7d9b78', ajanta: '#c6a16a',
}

const EARTH_TEXTURE =
  'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
const EARTH_BUMP =
  'https://unpkg.com/three-globe/example/img/earth-topology.png'
const STAR_BACKGROUND =
  'https://unpkg.com/three-globe/example/img/night-sky.png'

function MapFocus({ region }) {
  const map = useMap()

  useEffect(() => {
    if (region) {
      map.flyTo(region.position, 6, { duration: 0.8 })
    }
  }, [map, region])

  return null
}

function InteractiveGlobe({ onSelectRegion, onEnterMap }) {
  const globeRef = useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 600, height: 480 })
  const [globeReady, setGlobeReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const updateSize = () => {
      const width = Math.max(280, Math.floor(container.clientWidth))
      setDimensions({
        width,
        height: Math.min(560, Math.max(340, Math.floor(width * 0.83))),
      })
    }

    updateSize()

    let observer
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateSize)
      observer.observe(container)
    } else {
      window.addEventListener('resize', updateSize)
    }

    return () => {
      if (observer) observer.disconnect()
      else window.removeEventListener('resize', updateSize)
    }
  }, [])

  useEffect(() => {
    if (!globeReady || !globeRef.current) return

    const globe = globeRef.current
    globe.pointOfView({ lat: 22, lng: 82, altitude: 2.2 }, 900)

    const controls = globe.controls()
    if (controls) {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.35
      controls.enableDamping = true
      controls.dampingFactor = 0.08
      controls.minDistance = 150
      controls.maxDistance = 600
    }
  }, [globeReady])

  const points = useMemo(
    () =>
      regions.map((region) => ({
        ...region,
        lat: region.position[0],
        lng: region.position[1],
        size: region.id === 'bengal' ? 0.85 : 0.65,
        color: '#d9a46b',
      })),
    []
  )

  function selectGlobePoint(point) {
    const region = regions.find((item) => item.id === point.id)
    if (region) onSelectRegion(region)
  }

  function resetGlobe() {
    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: 22, lng: 82, altitude: 2.2 },
        900
      )
    }
  }

  return (
    <section className="globe-panel">
      <div className="globe-note">
        <span className="eyebrow">THE SUBCONTINENT</span>
        <h2>India, seen in its wider world</h2>
        <p>
          Rotate the Earth, zoom in, or select a glowing marker to discover
          the artistic traditions of a region.
        </p>
      </div>

      <div className="real-globe-wrap" ref={containerRef}>
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={EARTH_TEXTURE}
          bumpImageUrl={EARTH_BUMP}
          backgroundImageUrl={STAR_BACKGROUND}
          showAtmosphere
          atmosphereColor="#c8a477"
          atmosphereAltitude={0.16}
          showGraticules
          graticulesColor={() => 'rgba(225, 201, 159, 0.25)'}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointRadius="size"
          pointAltitude={0.012}
          pointResolution={12}
          pointsMerge={false}
          onPointClick={selectGlobePoint}
          pointLabel={(point) => `
            <div style="
              padding: 7px 10px;
              color: #f8f0df;
              background: #30271f;
              border: 1px solid #a78359;
              font-family: Georgia, serif;
            ">
              <strong>${point.name}</strong>
              <div style="font-size:11px;margin-top:4px;">
                ${point.category}
              </div>
              <div style="font-size:10px;margin-top:5px;">
                Click to explore
              </div>
            </div>
          `}
          onGlobeReady={() => setGlobeReady(true)}
        />

        <div className="globe-map-label">
          <span className="globe-map-dot" />
          INDIA &amp; ITS CULTURAL REGIONS
        </div>
      </div>

      <div className="globe-controls">
        <button className="view-button" onClick={resetGlobe}>
          <RotateCcw size={15} /> Reset view
        </button>
        <button className="primary-button" onClick={onEnterMap}>
          Open heritage map <ArrowRight size={16} />
        </button>
      </div>

      <p className="globe-caption">
        Select a marker to open that region on the heritage map. Drag to rotate;
        scroll to zoom.
      </p>
    </section>
  )
}

export default function App() {
  const [view, setView] = useState('map')
  const [search, setSearch] = useState('')
  const [activeRegion, setActiveRegion] = useState(null)
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kaladarshan-saved-regions') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('kaladarshan-saved-regions', JSON.stringify(saved))
    } catch {
      // Bookmarks still work for the current session if storage is unavailable.
    }
  }, [saved])

  const filteredRegions = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return regions

    return regions.filter((region) =>
      [
        region.name,
        region.place,
        region.category,
        region.history,
        region.detail,
        ...region.arts,
        ...(historyDetails[region.id]?.timeline || []).flatMap((item) => item),
        historyDetails[region.id]?.technique || '',
        ...(historyDetails[region.id]?.examples || []),
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [search])

  function toggleSaved(id) {
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    )
  }

  function openRegionOnMap(region) {
    setActiveRegion(region)
    setView('map')
    setSearch('')
    window.setTimeout(() => {
      document.getElementById('heritage-map')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }

  return (
    <div className="app">
      <header className="header">
        <a className="brand" href="#home">
          <span className="brand-icon">
            <Landmark size={23} />
          </span>
          <span>
            <strong>KalāDarshan</strong>
            <small>AN ATLAS OF INDIA&apos;S LIVING HERITAGE</small>
          </span>
        </a>

        <div className="header-actions">
          <label className="search-box">
            <Search size={17} />
            <input
              placeholder="Search a region, art or tradition..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </label>

          <button
            type="button"
            className={`view-button ${view === 'globe' ? 'active' : ''}`}
            onClick={() => setView('globe')}
          >
            <GlobeIcon size={16} /> Globe
          </button>

          <button
            type="button"
            className={`view-button ${view === 'map' ? 'active' : ''}`}
            onClick={() => setView('map')}
          >
            <MapIcon size={16} /> Heritage map
          </button>
        </div>
      </header>

      <main id="home">
        <section className="intro">
          <span className="eyebrow">A FIELD GUIDE TO INDIAN ART</span>
          <h1>
            India, told through
            <br />
            <em>its places and traditions.</em>
          </h1>
          <p>
            Follow the geography of Indian art — from Himalayan painting
            traditions to coastal ritual performances, textiles and ancient murals.
          </p>
        </section>

        {view === 'globe' ? (
          <InteractiveGlobe
            onSelectRegion={openRegionOnMap}
            onEnterMap={() => setView('map')}
          />
        ) : (
          <section className="map-section" id="heritage-map">
            <div className="section-heading">
              <div>
                <span className="eyebrow">EXPLORE BY CULTURAL REGION</span>
                <h2>The heritage map</h2>
                <p className="section-description">
                  Explore a physical-relief map with approximate cultural footprints.
                  Colours identify traditions, not political or state borders.
                </p>
              </div>
              <span className="result-count">
                {filteredRegions.length} regions
              </span>
            </div>

            <div className="map-layout">
              <div className="map-frame">
                <MapContainer
                  center={[22.8, 82.0]}
                  zoom={4.5}
                  minZoom={4}
                  maxZoom={9}
                  scrollWheelZoom
                  zoomControl
                  className="india-map"
                >
                  <TileLayer
                    attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> — World Physical Map'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={8}
                  />

                  <MapFocus region={activeRegion} />

                  {filteredRegions.map((region) => (
                    <Polygon
                      key={`${region.id}-area`}
                      positions={regionShapes[region.id]}
                      pathOptions={{
                        color: regionColors[region.id],
                        weight: activeRegion?.id === region.id ? 3 : 1.5,
                        opacity: 0.95,
                        fillColor: regionColors[region.id],
                        fillOpacity: activeRegion?.id === region.id ? 0.48 : 0.27,
                        dashArray: activeRegion?.id === region.id ? undefined : '4 3',
                      }}
                      eventHandlers={{ click: () => setActiveRegion(region) }}
                    >
                      <Tooltip sticky>
                        <strong>{region.name}</strong><br />
                        {region.category}
                      </Tooltip>
                    </Polygon>
                  ))}

                  {filteredRegions.map((region) => (
                    <CircleMarker
                      key={region.id}
                      center={region.position}
                      radius={activeRegion?.id === region.id ? 8 : 5.5}
                      pathOptions={{
                        color: '#fffaf0',
                        weight: 2,
                        fillColor: regionColors[region.id],
                        fillOpacity: 1,
                      }}
                      eventHandlers={{ click: () => setActiveRegion(region) }}
                    >
                      <Tooltip permanent direction="right" offset={[8, 0]} className="region-map-label-tooltip">
                        <strong>{region.name}</strong>
                      </Tooltip>
                    </CircleMarker>
                  ))}
                </MapContainer>

                <div className="map-caption">
                  <MapPin size={14} />
                  <span>Approximate cultural footprints · not administrative borders</span>
                </div>
                <div className="map-legend" aria-label="Map colour key">
                  <span><i style={{ background: '#6689a5' }} /> Himalaya</span>
                  <span><i style={{ background: '#c18c57' }} /> West</span>
                  <span><i style={{ background: '#8e9e63' }} /> East</span>
                  <span><i style={{ background: '#9b7958' }} /> Central</span>
                  <span><i style={{ background: '#9d7192' }} /> South</span>
                </div>
              </div>

              <aside className="region-list">
                <div className="region-list-heading">
                  <BookOpen size={17} />
                  <span>Regional index</span>
                </div>

                <div className="region-list-items">
                  {filteredRegions.map((region) => (
                    <button
                      type="button"
                      key={region.id}
                      className={`region-list-item ${
                        activeRegion?.id === region.id ? 'selected' : ''
                      }`}
                      onClick={() => setActiveRegion(region)}
                    >
                      <span className="region-dot" style={{ backgroundColor: regionColors[region.id] }} />
                      <span className="region-list-text">
                        <strong>{region.name}</strong>
                        <small>{region.category}</small>
                      </span>
                      <ArrowRight size={15} />
                    </button>
                  ))}

                  {filteredRegions.length === 0 && (
                    <p className="no-results">
                      No matching regions. Try another search.
                    </p>
                  )}
                </div>
              </aside>
            </div>

            {activeRegion ? (
              <article className="region-detail" key={activeRegion.id}>
                <div className="region-detail-top">
                  <div>
                    <span className="eyebrow">REGIONAL FIELD NOTE</span>
                    <h2>{activeRegion.name}</h2>
                    <span className="location">
                      <MapPin size={14} /> {activeRegion.place}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="bookmark-button detail-bookmark"
                    onClick={() => toggleSaved(activeRegion.id)}
                  >
                    <Bookmark
                      size={17}
                      fill={
                        saved.includes(activeRegion.id) ? 'currentColor' : 'none'
                      }
                    />
                    {saved.includes(activeRegion.id) ? 'Saved' : 'Save region'}
                  </button>
                </div>

                <figure className="region-artwork">
                  <img
                    src={activeRegion.image}
                    alt={`Artwork representing ${activeRegion.name}`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.closest('figure')?.classList.add('image-unavailable')
                    }}
                  />
                  <figcaption>
                    <span className="artwork-caption-label">VISUAL ARCHIVE</span>
                    <span>Artwork associated with {activeRegion.name}. Image identification and attribution should be checked against the original source.</span>
                  </figcaption>
                </figure>

                <div className="historical-overview">
                  <div className="historical-overview-heading">
                    <span className="eyebrow">HISTORICAL READING</span>
                    <h3>From context to continuity</h3>
                  </div>
                  <div className="timeline-list">
                    {(historyDetails[activeRegion.id]?.timeline || []).map(([period, description]) => (
                      <div className="timeline-item" key={period}>
                        <span className="timeline-marker" style={{ backgroundColor: regionColors[activeRegion.id] }} />
                        <div>
                          <h4>{period}</h4>
                          <p>{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="region-detail-grid">
                  <div className="region-history">
                    <h3>History and context</h3>
                    <p>{activeRegion.history}</p>

                    <h3>What to look for</h3>
                    <p>{activeRegion.detail}</p>

                    <p className="influence">
                      <strong>Shaping influences:</strong>{' '}
                      {activeRegion.influence}.
                    </p>
                  </div>

                  <div className="region-art-list">
                    <h3>Art forms and traditions</h3>
                    {activeRegion.arts.map((art) => (
                      <div className="art-form-row" key={art}>
                        <Palette size={16} />
                        <span>{art}</span>
                      </div>
                    ))}

                    <p className="period">
                      <Clock size={15} /> {activeRegion.period}
                    </p>
                  </div>
                </div>

                <div className="heritage-context-grid">
                  <section className="context-card">
                    <span className="eyebrow">MATERIAL & METHOD</span>
                    <h3>How the art is made</h3>
                    <p>{historyDetails[activeRegion.id]?.technique}</p>
                  </section>
                  <section className="context-card">
                    <span className="eyebrow">OBJECTS TO EXPLORE</span>
                    <h3>Examples and visual clues</h3>
                    <ul>
                      {(historyDetails[activeRegion.id]?.examples || []).map((example) => (
                        <li key={example}>{example}</li>
                      ))}
                    </ul>
                  </section>
                  <section className="context-card context-card-wide">
                    <span className="eyebrow">CONTINUITY & CARE</span>
                    <h3>The tradition today</h3>
                    <p>{historyDetails[activeRegion.id]?.living}</p>
                  </section>
                </div>

                <p className="source-note">
                  Historical summaries are introductory and may combine evidence from different periods. Traditions vary by community, maker and locality; captions should identify individual objects and sources wherever possible.
                </p>
              </article>
            ) : (
              <div className="map-instructions">
                <Compass size={22} />
                <div>
                  <h3>Choose a cultural region</h3>
                  <p>
                    Select any map marker or name in the regional index to begin
                    exploring.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="quote-section">
          <span className="eyebrow">A LIVING HERITAGE</span>
          <p>
            Every region carries its own ways of seeing, making and remembering.
            Together, they tell many stories of India.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span>KalāDarshan · A field guide to India&apos;s living heritage</span>
        <span>{saved.length} saved regions</span>
      </footer>
    </div>
  )
}
